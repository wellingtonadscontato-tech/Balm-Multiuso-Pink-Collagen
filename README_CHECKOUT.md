# Stripe Embedded Checkout, Durable Storage & Shopify Bridge

This landing page features a **100% incorporated Stripe Embedded Checkout** running directly inside the application, backed by an authoritative Express server and automated Shopify order bridge.

---

## 1. Security & Privacy Guarantees

1. **Zero Public PII**:
   - Customer emails, names, and shipping addresses are **NEVER exposed on public routes**.
   - Session status queries (`/api/checkout/session-status`) require an opaque cryptographic buyer verification token issued during session creation, and return only non-PII payment status flags.
2. **Authenticated Operator Endpoints**:
   - `/api/checkout/operator-status` and retry routes require `OPERATOR_AUTH_TOKEN` in header `x-operator-auth-token` or `Authorization: Bearer <token>`.
   - Never exposed to the frontend.
3. **Strict Production Gatekeeping**:
   - The server **blocks real production session creation** if either `DATABASE_URL` (durable storage) or `SHOPIFY_ADMIN_API_TOKEN` is missing.
   - Local JSON files are allowed strictly in development/testing. Cloud Run containers have ephemeral filesystems; hence, production requires PostgreSQL for ACID transaction integrity.
4. **Authoritative Pricing**:
   - Single: $24.99 USD (2499 cents)
   - Duo: $34.99 USD (3499 cents)
   - Quad: $59.99 USD (5999 cents)
   - Validated server-side; client prices are discarded.
5. **Payment Verification Exclusively on Signed Webhook**:
   - Orders are never marked paid purely by client `onComplete`.
   - Payment is only validated after cryptographically checking the raw body signature of `checkout.session.completed` with `payment_status: 'paid'`.

---

## 2. Server Environment Variables (.env)

```env
# Stripe (Use test keys pk_test_... / sk_test_... during staging)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Durable Transactional Storage (Required in Cloud Run Production)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Shopify Order Bridge
SHOPIFY_STORE_DOMAIN="6u0kc1-nm.myshopify.com"
SHOPIFY_ADMIN_API_TOKEN="shpat_..."

# Operator Security
OPERATOR_AUTH_TOKEN="sec_operator_token_here"

# Fallback Flag (default: false)
ENABLE_SHOPIFY_FALLBACK="false"
```

---

## 3. Pre-Live Testing Guide (Stripe Test Mode)

Before switching to live keys, test the complete flow using test keys:

1. In Stripe Dashboard, toggle to **Test mode**.
2. Copy `pk_test_...` and `sk_test_...` into `.env`.
3. In local terminal, use the **Stripe CLI** to test the webhook and raw body signature:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
4. Copy the generated webhook secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
5. Trigger test payments using Stripe test cards:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Country: United States
6. Observe:
   - Server validates integer quantity (1–10 kits) and authoritative USD prices.
   - Webhook raw body signature is verified.
   - Persistent idempotency ledger records the event and session.
   - Order is queued for Shopify import with unfulfilled status for DSers.

---

## 4. PostgreSQL DDL Schema (For Production Setup)

Run the following DDL on your PostgreSQL database (e.g. Supabase, Cloud SQL):

```sql
-- 1. Durable Processed Events Ledger (Idempotency)
CREATE TABLE IF NOT EXISTS stripe_processed_events (
  event_id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  session_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  shopify_order_id BIGINT,
  error_message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stripe Checkout Orders Ledger
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

CREATE INDEX IF NOT EXISTS idx_stripe_orders_shopify_status ON stripe_checkout_orders(shopify_status);
```

---

## 5. Fulfillment Compatibility (DSers)

- When an order is bridged from Stripe to Shopify, it is created with:
  - `financial_status: 'paid'`
  - `fulfillment_status: null` (unfulfilled)
  - `tags: 'stripe-embedded,ai-studio,usa-free-shipping'`
- **DSers** automatically detects the paid, unfulfilled order with the mapped variant IDs and processes supplier dispatch as expected.
