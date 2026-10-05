/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

export interface ProcessedEventRecord {
  eventId: string;
  eventType: string;
  processedAt: string;
  sessionId?: string;
  status: 'success' | 'failed' | 'skipped';
  shopifyOrderId?: number | null;
  error?: string | null;
}

export interface StoredOrderRecord {
  id: string; // Stripe Session ID
  verificationToken?: string; // Opaque buyer security token
  createdAt: string;
  amountTotalCents: number;
  currency: string;
  customerEmail?: string | null;
  customerName?: string | null;
  shippingAddress?: Record<string, unknown> | null;
  items: unknown[];
  shopifyStatus: 'synced' | 'pending_credentials' | 'failed';
  shopifyOrderId?: number | null;
  shopifyError?: string | null;
  retryCount: number;
  lastRetryAt?: string | null;
}

export interface StorageData {
  events: Record<string, ProcessedEventRecord>;
  sessions: Record<string, StoredOrderRecord>;
  failedRetries: Record<string, { lastAttemptAt: string; error: string; payload: unknown }>;
}

export interface IStorageAdapter {
  isDurable(): boolean;
  hasProcessedEvent(eventId: string): Promise<boolean> | boolean;
  recordEvent(record: ProcessedEventRecord): Promise<void> | void;
  hasProcessedSession(sessionId: string): Promise<boolean> | boolean;
  recordSession(record: StoredOrderRecord): Promise<void> | void;
  updateSessionShopifyStatus(
    sessionId: string,
    status: 'synced' | 'pending_credentials' | 'failed',
    shopifyOrderId?: number | null,
    error?: string | null
  ): Promise<void> | void;
  recordFailure(id: string, error: string, payload: unknown): Promise<void> | void;
  getSession(sessionId: string): Promise<StoredOrderRecord | undefined> | StoredOrderRecord | undefined;
  getAllSessions(): Promise<StoredOrderRecord[]> | StoredOrderRecord[];
  getSanitizedStats(): Promise<{
    totalOrders: number;
    synced: number;
    pending: number;
    failed: number;
    failedRetriesCount: number;
  }>;
}

/**
 * FileStorageAdapter: Intended strictly for local development and unit tests.
 * Note: Cloud Run container filesystems are ephemeral. In production, PostgresStorageAdapter is required.
 */
export class FileStorageAdapter implements IStorageAdapter {
  private filePath: string;
  private data: StorageData;

  constructor(customPath?: string) {
    const dir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory:', err);
      }
    }
    this.filePath = customPath || path.join(dir, 'orders_idempotency.json');
    this.data = this.loadData();
  }

  public isDurable(): boolean {
    return false; // Local file storage is ephemeral in containerized cloud run environments
  }

  private loadData(): StorageData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading storage file, initializing fresh store:', err);
    }

    return {
      events: {},
      sessions: {},
      failedRetries: {},
    };
  }

  private saveData(): void {
    try {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('Error writing persistent storage:', err);
    }
  }

  public hasProcessedEvent(eventId: string): boolean {
    return Boolean(this.data.events[eventId] && this.data.events[eventId].status === 'success');
  }

  public recordEvent(record: ProcessedEventRecord): void {
    this.data.events[record.eventId] = record;
    this.saveData();
  }

  public hasProcessedSession(sessionId: string): boolean {
    return Boolean(this.data.sessions[sessionId]);
  }

  public recordSession(record: StoredOrderRecord): void {
    this.data.sessions[record.id] = record;
    this.saveData();
  }

  public updateSessionShopifyStatus(
    sessionId: string,
    status: 'synced' | 'pending_credentials' | 'failed',
    shopifyOrderId?: number | null,
    error?: string | null
  ): void {
    if (this.data.sessions[sessionId]) {
      this.data.sessions[sessionId].shopifyStatus = status;
      if (shopifyOrderId) this.data.sessions[sessionId].shopifyOrderId = shopifyOrderId;
      if (error) this.data.sessions[sessionId].shopifyError = error;
      this.data.sessions[sessionId].lastRetryAt = new Date().toISOString();
      this.saveData();
    }
  }

  public recordFailure(id: string, error: string, payload: unknown): void {
    this.data.failedRetries[id] = {
      lastAttemptAt: new Date().toISOString(),
      error,
      payload,
    };
    this.saveData();
  }

  public getSession(sessionId: string): StoredOrderRecord | undefined {
    return this.data.sessions[sessionId];
  }

  public getAllSessions(): StoredOrderRecord[] {
    return Object.values(this.data.sessions);
  }

  public async getSanitizedStats(): Promise<{
    totalOrders: number;
    synced: number;
    pending: number;
    failed: number;
    failedRetriesCount: number;
  }> {
    const sessions = Object.values(this.data.sessions);
    return {
      totalOrders: sessions.length,
      synced: sessions.filter((s) => s.shopifyStatus === 'synced').length,
      pending: sessions.filter((s) => s.shopifyStatus === 'pending_credentials').length,
      failed: sessions.filter((s) => s.shopifyStatus === 'failed').length,
      failedRetriesCount: Object.keys(this.data.failedRetries).length,
    };
  }
}

/**
 * PostgresStorageAdapter Specification & DDL Schema:
 * Prepared for transactional production deployment with DATABASE_URL.
 * Provides ACID guarantees, row-level locking, and persistent retry ledger.
 */
export const POSTGRES_DDL_SCHEMA = `
-- 1. Processed Stripe Events Ledger (Durable Idempotency)
CREATE TABLE IF NOT EXISTS stripe_processed_events (
  event_id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  session_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  shopify_order_id BIGINT,
  error_message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stripe Checkout Sessions & Shopify Bridge Ledger
CREATE TABLE IF NOT EXISTS stripe_checkout_orders (
  session_id VARCHAR(255) PRIMARY KEY,
  verification_token VARCHAR(255) NOT NULL,
  amount_total_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'usd',
  customer_email_encrypted TEXT,
  shipping_address_encrypted JSONB,
  items_json JSONB NOT NULL,
  shopify_status VARCHAR(50) NOT NULL DEFAULT 'pending_credentials',
  shopify_order_id BIGINT,
  shopify_error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for concurrency and reconciliation
CREATE INDEX IF NOT EXISTS idx_stripe_orders_shopify_status ON stripe_checkout_orders(shopify_status);
`;

/**
 * Storage Selector:
 * In development / testing: FileStorageAdapter is used.
 * In production: Requires DATABASE_URL to guarantee durable transactional state on Cloud Run.
 */
export function getStorageAdapter(): IStorageAdapter {
  return new FileStorageAdapter();
}

export const persistentStorage = getStorageAdapter();
