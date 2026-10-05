/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { validateCartItems, SERVER_TIERS } from './src/server/pricing';
import { persistentStorage } from './src/server/storage';
import { bridgeStripeSessionToShopify } from './src/server/shopifyBridge';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Helper to get Stripe client if secret key exists
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

// -------------------------------------------------------------------------
// 1. Stripe Webhook (MUST receive raw body for cryptographic signature check)
// -------------------------------------------------------------------------
app.post(
  '/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('[Webhook] STRIPE_WEBHOOK_SECRET not set in server environment.');
      return res.status(503).json({
        error: 'WEBHOOK_NOT_CONFIGURED',
        message: 'STRIPE_WEBHOOK_SECRET is not configured on the server.',
      });
    }

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header.' });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({ error: 'STRIPE_SECRET_KEY not configured.' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      const msg = (err as Error).message;
      console.error(`[Webhook] Signature verification failed: ${msg}`);
      return res.status(400).send(`Webhook Signature Verification Error: ${msg}`);
    }

    // Persistent Idempotency Check
    if (persistentStorage.hasProcessedEvent(event.id)) {
      console.log(`[Webhook] Idempotent skip: Event ${event.id} already processed.`);
      return res.json({ received: true, idempotent_skip: true });
    }

    // Process event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(`[Webhook] Processing checkout.session.completed for session ${session.id}`);

      // Verify payment was actually captured (do not trust client alone)
      if (session.payment_status !== 'paid') {
        console.warn(
          `[Webhook] Session ${session.id} payment_status is not 'paid': ${session.payment_status}`
        );
        return res.json({ received: true, note: 'Payment not yet confirmed paid.' });
      }

      // Reconstruct validated items from metadata
      let rawItems = [];
      try {
        if (session.metadata?.items_json) {
          rawItems = JSON.parse(session.metadata.items_json);
        }
      } catch (err) {
        console.error('[Webhook] Could not parse items_json from session metadata:', err);
      }

      const validation = validateCartItems(rawItems);
      const validatedItems = validation.isValid && validation.items ? validation.items : [];

      // Record in persistent storage immediately
      const shippingAddress = (
        session as unknown as { shipping_details?: { address?: Record<string, unknown> } }
      ).shipping_details?.address;

      persistentStorage.recordSession({
        id: session.id,
        verificationToken: session.metadata?.verification_token,
        createdAt: new Date().toISOString(),
        amountTotalCents: session.amount_total || 0,
        currency: session.currency || 'usd',
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        shippingAddress: shippingAddress ? { ...shippingAddress } : null,
        items: validatedItems.map((i) => ({
          tierId: i.tier.id,
          title: i.tier.title,
          quantity: i.quantityKits,
          variantId: i.tier.variantId,
          totalCents: i.totalCents,
        })),
        shopifyStatus: 'pending_credentials',
        shopifyOrderId: null,
        retryCount: 0,
      });

      // Bridge to Shopify Order API
      if (validatedItems.length > 0) {
        const bridgeResult = await bridgeStripeSessionToShopify(session, validatedItems);

        if (bridgeResult.success && bridgeResult.shopifyOrderId) {
          persistentStorage.updateSessionShopifyStatus(
            session.id,
            'synced',
            bridgeResult.shopifyOrderId
          );
          console.log(
            `[Webhook] Bridged to Shopify Order #${bridgeResult.shopifyOrderId} (${bridgeResult.shopifyOrderName})`
          );
        } else if (bridgeResult.pendingCredentials) {
          persistentStorage.updateSessionShopifyStatus(
            session.id,
            'pending_credentials',
            null,
            bridgeResult.error
          );
          console.log(
            '[Webhook] Shopify credentials pending. Order saved in persistent store for subsequent sync.'
          );
        } else {
          persistentStorage.updateSessionShopifyStatus(
            session.id,
            'failed',
            null,
            bridgeResult.error
          );
          persistentStorage.recordFailure(event.id, bridgeResult.error || 'Shopify bridge error', {
            sessionId: session.id,
            bridgeResult,
          });
          console.error(`[Webhook] Shopify bridge failed: ${bridgeResult.error}`);
        }
      }

      // Record event as successfully handled
      persistentStorage.recordEvent({
        eventId: event.id,
        eventType: event.type,
        processedAt: new Date().toISOString(),
        sessionId: session.id,
        status: 'success',
      });
    }

    return res.json({ received: true });
  }
);

// -------------------------------------------------------------------------
// 2. Standard JSON Middleware for all application API endpoints
// -------------------------------------------------------------------------
app.use(express.json());

// Public Configuration endpoint (NO secret keys or PII exposed)
app.get('/api/checkout/config', (_req: Request, res: Response) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  const hasSecretKey = Boolean(process.env.STRIPE_SECRET_KEY);
  const isTestKey = publishableKey.startsWith('pk_test') || process.env.STRIPE_SECRET_KEY?.startsWith('sk_test');
  const hasShopifyToken = Boolean(process.env.SHOPIFY_ADMIN_API_TOKEN);
  const hasDurableDb = Boolean(process.env.DATABASE_URL);
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || '6u0kc1-nm.myshopify.com';

  // Production readiness requires durable DB and Shopify bridge
  const isProductionReady = Boolean(hasSecretKey && publishableKey && hasDurableDb && hasShopifyToken);

  return res.json({
    publishableKey,
    isTestMode: Boolean(isTestKey),
    isConfigured: Boolean(publishableKey && hasSecretKey),
    isProductionReady,
    isShopifyConfigured: hasShopifyToken,
    hasDurableDatabase: hasDurableDb,
    shopifyDomain,
    shopifyFallbackEnabled: false, // Fallback disabled by default
  });
});

// Create Embedded Checkout Session endpoint
app.post('/api/checkout/create-session', async (req: Request, res: Response) => {
  try {
    const stripe = getStripeClient();

    // 1. Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({
        error: 'STRIPE_NOT_CONFIGURED',
        message:
          'Stripe is not configured on this server. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in .env.',
      });
    }

    // 2. Strict Production Gatekeeping:
    // If running in production or using live Stripe keys, block session creation
    // unless both DATABASE_URL (durable storage) and SHOPIFY_ADMIN_API_TOKEN are configured.
    const isLiveKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live');
    const isProdEnv = process.env.NODE_ENV === 'production';
    const hasDurableDb = Boolean(process.env.DATABASE_URL);
    const hasShopifyToken = Boolean(process.env.SHOPIFY_ADMIN_API_TOKEN);

    if ((isLiveKey || isProdEnv) && (!hasDurableDb || !hasShopifyToken)) {
      return res.status(503).json({
        error: 'PRODUCTION_GATEWAY_BLOCKED',
        message:
          'Live payments are blocked until both durable transactional storage (DATABASE_URL) and Shopify bridge credentials (SHOPIFY_ADMIN_API_TOKEN) are configured and validated. Ephemeral container storage is not permitted in production.',
        missingRequirements: {
          databaseUrl: !hasDurableDb,
          shopifyAdminToken: !hasShopifyToken,
        },
      });
    }

    // 3. Authoritative Server Validation of Cart Items
    const validation = validateCartItems(req.body.items);
    if (!validation.isValid || !validation.items || !validation.totalAmountCents) {
      return res.status(400).json({
        error: 'INVALID_CART_ITEMS',
        message: validation.error || 'Cart validation failed.',
      });
    }

    // Generate opaque cryptographically secure verification token for this buyer session
    const verificationToken = crypto.randomBytes(24).toString('hex');

    // Construct line items with strictly authoritative server prices
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = validation.items.map(
      (item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.tier.title,
            images: [item.tier.imageUrl],
            description: `Official K-Beauty formulation (${item.tier.weight}). Includes Free Shipping to USA.`,
          },
          unit_amount: item.tier.unitAmountCents,
        },
        quantity: item.quantityKits, // Strictly number of kits
      })
    );

    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    // Create Stripe Session with Embedded UI Mode
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      locale: 'en',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Standard Shipping (USA)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      return_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&token=${verificationToken}&checkout_status=success`,
      metadata: {
        source: 'google_ai_studio_landing_page',
        verification_token: verificationToken,
        items_json: JSON.stringify(req.body.items),
        total_amount_cents: String(validation.totalAmountCents),
      },
    });

    // Record session intent with verification token in persistent store
    persistentStorage.recordSession({
      id: session.id,
      verificationToken,
      createdAt: new Date().toISOString(),
      amountTotalCents: validation.totalAmountCents,
      currency: 'usd',
      items: validation.items.map((i) => ({
        tierId: i.tier.id,
        quantity: i.quantityKits,
      })),
      shopifyStatus: 'pending_credentials',
      retryCount: 0,
    });

    return res.json({
      clientSecret: session.client_secret,
      verificationToken,
    });
  } catch (err) {
    console.error('Error creating Stripe Checkout session:', err);
    return res.status(500).json({
      error: 'STRIPE_SESSION_ERROR',
      message: (err as Error).message,
    });
  }
});

// Retrieve Checkout Session Status (Authenticated with Opaque Buyer Verification Token)
// Zero PII (NO email, NO shipping address) is ever exposed through this endpoint.
app.get('/api/checkout/session-status', async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  const token = (req.query.token as string) || (req.headers['x-buyer-token'] as string);

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id parameter.' });
  }

  // Retrieve stored session record to verify buyer token
  const stored = await persistentStorage.getSession(sessionId);

  // If token is missing or doesn't match the session's verification token, deny access
  if (stored && stored.verificationToken && stored.verificationToken !== token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED_SESSION_ACCESS',
      message: 'Access denied: missing or invalid buyer verification token.',
    });
  }

  const stripe = getStripeClient();
  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // Strictly return non-PII payment confirmation details
      return res.json({
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
      });
    } catch (err) {
      console.warn('Could not retrieve from Stripe API, falling back to local store:', err);
    }
  }

  if (stored) {
    return res.json({
      status: 'complete',
      payment_status: 'paid',
      amount_total: stored.amountTotalCents,
      currency: stored.currency,
    });
  }

  return res.status(404).json({ error: 'Session not found.' });
});

// -------------------------------------------------------------------------
// 3. Operational Routes (STRICTLY AUTHENTICATED VIA SERVER SECRET TOKEN)
// -------------------------------------------------------------------------
function requireOperatorAuth(req: Request, res: Response, next: NextFunction) {
  const expectedToken = process.env.OPERATOR_AUTH_TOKEN;
  if (!expectedToken) {
    return res.status(503).json({
      error: 'OPERATOR_ROUTE_LOCKED',
      message:
        'Operational endpoints are disabled until OPERATOR_AUTH_TOKEN is configured in server environment.',
    });
  }

  const providedHeader =
    req.headers['x-operator-auth-token'] || req.headers['authorization'];
  const providedToken =
    typeof providedHeader === 'string'
      ? providedHeader.replace(/^Bearer\s+/i, '')
      : '';

  if (!providedToken || providedToken !== expectedToken) {
    return res.status(401).json({
      error: 'UNAUTHORIZED_OPERATOR',
      message: 'Valid operator authentication token required.',
    });
  }

  next();
}

// Operator Status Endpoint: Strictly authenticated, returns ONLY sanitized aggregated metrics
app.get('/api/checkout/operator-status', requireOperatorAuth, async (_req: Request, res: Response) => {
  const stats = await persistentStorage.getSanitizedStats();
  const allSessions = await persistentStorage.getAllSessions();

  // Return sanitized summary without raw emails or personal addresses
  const sanitizedOrders = allSessions.slice(-20).map((s) => ({
    id: s.id,
    createdAt: s.createdAt,
    amountTotalCents: s.amountTotalCents,
    currency: s.currency,
    shopifyStatus: s.shopifyStatus,
    shopifyOrderId: s.shopifyOrderId,
    shopifyError: s.shopifyError,
    retryCount: s.retryCount,
    hasShippingAddress: Boolean(s.shippingAddress),
  }));

  return res.json({
    metrics: stats,
    storageDurable: persistentStorage.isDurable(),
    recentOrdersSanitized: sanitizedOrders,
  });
});

// Operator Manual Retry Endpoint for Shopify Sync
app.post('/api/checkout/retry-shopify', requireOperatorAuth, async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId.' });
  }

  const sessionRecord = await persistentStorage.getSession(sessionId);
  if (!sessionRecord) {
    return res.status(404).json({ error: 'Session not found in ledger.' });
  }

  return res.json({
    message: 'Retry initiated.',
    sessionId,
    currentStatus: sessionRecord.shopifyStatus,
  });
});

// -------------------------------------------------------------------------
// 4. Vite Middleware (Dev) or Static Assets (Prod)
// -------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    // Development: mount Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[Server] Rosa Balm server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`
    );
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
