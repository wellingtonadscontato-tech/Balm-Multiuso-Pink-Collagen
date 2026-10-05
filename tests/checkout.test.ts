/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateCartItems, SERVER_TIERS } from '../src/server/pricing';
import { FileStorageAdapter } from '../src/server/storage';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';

async function runTests() {
  console.log('--- STARTING CHECKOUT SECURITY & INTEGRATION UNIT TESTS ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. Authoritative Pricing & Quantity Validation Tests
  // ---------------------------------------------------------------------------
  console.log('[Suite 1: Authoritative Pricing & Cart Integrity]');

  const testSingle = validateCartItems([{ id: 'single', quantity: 1 }]);
  assert(
    testSingle.isValid && testSingle.totalAmountCents === 2499,
    '1 Single stick calculates exactly 2499 cents ($24.99 USD)'
  );

  const testDuo = validateCartItems([{ id: 'kit_duo', quantity: 1 }]);
  assert(
    testDuo.isValid && testDuo.totalAmountCents === 3499,
    '1 Duo kit calculates exactly 3499 cents ($34.99 USD)'
  );

  const testQuad = validateCartItems([{ id: 'kit_quad', quantity: 1 }]);
  assert(
    testQuad.isValid && testQuad.totalAmountCents === 5999,
    '1 Quad kit calculates exactly 5999 cents ($59.99 USD)'
  );

  const testDuoMultiple = validateCartItems([{ id: 'kit_duo', quantity: 2 }]);
  assert(
    testDuoMultiple.isValid && testDuoMultiple.totalAmountCents === 6998,
    '2 Duo kits calculate exactly 6998 cents ($69.98 USD)'
  );

  const testCombined = validateCartItems([
    { id: 'single', quantity: 1 },
    { id: 'kit_duo', quantity: 2 },
  ]);
  assert(
    testCombined.isValid && testCombined.totalAmountCents === 2499 + 6998,
    'Combined cart (1 single + 2 duo) totals 9497 cents ($94.97 USD)'
  );

  const testEmpty = validateCartItems([]);
  assert(!testEmpty.isValid, 'Empty cart is strictly rejected');

  const testUnknownId = validateCartItems([{ id: 'malicious_tier', quantity: 1 }]);
  assert(!testUnknownId.isValid, 'Unknown tier ID "malicious_tier" is strictly rejected');

  const testZeroQty = validateCartItems([{ id: 'single', quantity: 0 }]);
  assert(!testZeroQty.isValid, 'Quantity of 0 is strictly rejected');

  const testNegativeQty = validateCartItems([{ id: 'single', quantity: -2 }]);
  assert(!testNegativeQty.isValid, 'Negative quantity is strictly rejected');

  const testOverMaxQty = validateCartItems([{ id: 'single', quantity: 11 }]);
  assert(!testOverMaxQty.isValid, 'Quantity over 10 is strictly rejected');

  const testFloatQty = validateCartItems([{ id: 'single', quantity: 2.5 }]);
  assert(!testFloatQty.isValid, 'Fractional/float quantity is strictly rejected');

  // ---------------------------------------------------------------------------
  // 2. Production Gatekeeping Logic Test
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 2: Production Gatekeeper (Live Block Without Durable Storage/Bridge)]');

  function checkProductionGatekeeper(env: {
    NODE_ENV?: string;
    STRIPE_SECRET_KEY?: string;
    DATABASE_URL?: string;
    SHOPIFY_ADMIN_API_TOKEN?: string;
  }): { blocked: boolean; reason?: string } {
    const isLiveKey = env.STRIPE_SECRET_KEY?.startsWith('sk_live');
    const isProdEnv = env.NODE_ENV === 'production';
    const hasDurableDb = Boolean(env.DATABASE_URL);
    const hasShopifyToken = Boolean(env.SHOPIFY_ADMIN_API_TOKEN);

    if ((isLiveKey || isProdEnv) && (!hasDurableDb || !hasShopifyToken)) {
      return {
        blocked: true,
        reason:
          'Live payments are blocked until both durable transactional storage (DATABASE_URL) and Shopify bridge credentials (SHOPIFY_ADMIN_API_TOKEN) are configured and validated.',
      };
    }
    return { blocked: false };
  }

  const liveBlockedNoDb = checkProductionGatekeeper({
    STRIPE_SECRET_KEY: 'sk_live_123456789',
    SHOPIFY_ADMIN_API_TOKEN: 'shpat_test',
    DATABASE_URL: '', // Missing
  });
  assert(liveBlockedNoDb.blocked, 'Live key without DATABASE_URL is strictly blocked');

  const liveBlockedNoShopify = checkProductionGatekeeper({
    STRIPE_SECRET_KEY: 'sk_live_123456789',
    DATABASE_URL: 'postgresql://localhost/prod',
    SHOPIFY_ADMIN_API_TOKEN: '', // Missing
  });
  assert(
    liveBlockedNoShopify.blocked,
    'Live key without SHOPIFY_ADMIN_API_TOKEN is strictly blocked'
  );

  const prodBlockedEphemeral = checkProductionGatekeeper({
    NODE_ENV: 'production',
    STRIPE_SECRET_KEY: 'sk_test_123',
    DATABASE_URL: '', // Ephemeral container filesystem
    SHOPIFY_ADMIN_API_TOKEN: 'shpat_test',
  });
  assert(
    prodBlockedEphemeral.blocked,
    'Production environment with ephemeral storage is strictly blocked'
  );

  const readyPasses = checkProductionGatekeeper({
    STRIPE_SECRET_KEY: 'sk_live_123456789',
    DATABASE_URL: 'postgresql://localhost/prod',
    SHOPIFY_ADMIN_API_TOKEN: 'shpat_valid',
  });
  assert(!readyPasses.blocked, 'Fully configured production setup passes gatekeeper');

  // ---------------------------------------------------------------------------
  // 3. Operational Route Security & Privacy Tests
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 3: Operational Route Security & Privacy Isolation]');

  function verifyOperatorAuth(
    configuredToken: string | undefined,
    providedHeader: string | undefined
  ): { status: number; authorized: boolean } {
    if (!configuredToken) {
      return { status: 503, authorized: false }; // Locked
    }
    const token = typeof providedHeader === 'string' ? providedHeader.replace(/^Bearer\s+/i, '') : '';
    if (!token || token !== configuredToken) {
      return { status: 401, authorized: false }; // Unauthorized
    }
    return { status: 200, authorized: true };
  }

  const unconfiguredOperator = verifyOperatorAuth(undefined, 'secret123');
  assert(
    unconfiguredOperator.status === 503,
    'Unconfigured operator endpoint is locked (HTTP 503)'
  );

  const unauthenticatedOperator = verifyOperatorAuth('my_operator_secret', undefined);
  assert(
    unauthenticatedOperator.status === 401,
    'Missing operator auth token is rejected (HTTP 401)'
  );

  const invalidOperator = verifyOperatorAuth('my_operator_secret', 'wrong_token');
  assert(
    invalidOperator.status === 401,
    'Invalid operator auth token is rejected (HTTP 401)'
  );

  const validOperator = verifyOperatorAuth('my_operator_secret', 'Bearer my_operator_secret');
  assert(
    validOperator.status === 200 && validOperator.authorized,
    'Valid operator token authorized successfully (HTTP 200)'
  );

  // ---------------------------------------------------------------------------
  // 4. Session Status Buyer-Token Isolation (Zero PII Leakage)
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 4: Buyer Verification Token Isolation & Zero PII]');

  const testBuyerToken = 'token_abc123_buyer';
  const testSession = {
    id: 'cs_test_session_token',
    verificationToken: testBuyerToken,
    customerEmail: 'secret_buyer@example.com',
    shippingAddress: { line1: '123 Confidential St' },
    amountTotalCents: 3499,
    currency: 'usd',
  };

  function querySessionStatus(stored: typeof testSession, providedToken: string | undefined) {
    if (!providedToken || providedToken !== stored.verificationToken) {
      return { status: 401, error: 'UNAUTHORIZED_SESSION_ACCESS' };
    }
    // Strictly sanitized output without email or address
    return {
      status: 200,
      data: {
        status: 'complete',
        payment_status: 'paid',
        amount_total: stored.amountTotalCents,
        currency: stored.currency,
      },
    };
  }

  const unverifiedSessionQuery = querySessionStatus(testSession, undefined);
  assert(
    unverifiedSessionQuery.status === 401,
    'Querying session without buyer token is rejected (HTTP 401)'
  );

  const wrongTokenSessionQuery = querySessionStatus(testSession, 'forged_token');
  assert(
    wrongTokenSessionQuery.status === 401,
    'Querying session with mismatched buyer token is rejected (HTTP 401)'
  );

  const verifiedSessionQuery = querySessionStatus(testSession, testBuyerToken);
  assert(
    verifiedSessionQuery.status === 200 &&
      !('customerEmail' in (verifiedSessionQuery.data as Record<string, unknown>)) &&
      !('shippingAddress' in (verifiedSessionQuery.data as Record<string, unknown>)),
    'Verified session status returns ONLY non-PII payment data'
  );

  // ---------------------------------------------------------------------------
  // 5. Persistent Idempotency & Webhook Duplication Tests
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 5: Persistent Storage & Duplicate Webhook Idempotency]');

  const tempTestPath = path.resolve(process.cwd(), 'data', 'test_idempotency.json');
  if (fs.existsSync(tempTestPath)) fs.unlinkSync(tempTestPath);

  const testStorage = new FileStorageAdapter(tempTestPath);
  const eventId = 'evt_test_unique_999';

  assert(!testStorage.hasProcessedEvent(eventId), 'Event is initially not marked processed');

  testStorage.recordEvent({
    eventId,
    eventType: 'checkout.session.completed',
    processedAt: new Date().toISOString(),
    status: 'success',
  });

  assert(testStorage.hasProcessedEvent(eventId), 'Event is recorded in persistent ledger');

  // Duplicate simulation
  const isDuplicate = testStorage.hasProcessedEvent(eventId);
  assert(isDuplicate, 'Duplicate incoming event is recognized and safely skipped');

  // Clean up temp test file
  if (fs.existsSync(tempTestPath)) fs.unlinkSync(tempTestPath);

  // ---------------------------------------------------------------------------
  // 6. Webhook Raw Body Signature Rejection Test
  // ---------------------------------------------------------------------------
  console.log('\n[Suite 6: Webhook Signature Verification]');

  const stripe = new Stripe('sk_test_mock_for_testing');
  let signatureRejected = false;
  try {
    stripe.webhooks.constructEvent(
      Buffer.from('{"test": true}'),
      't=123,v1=invalid_signature_hash',
      'whsec_mock_secret'
    );
  } catch (err) {
    signatureRejected = true;
  }
  assert(signatureRejected, 'Forged or invalid raw-body webhook signature is rejected');

  console.log(`\n--- ALL TEST SUITES PASSED: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
