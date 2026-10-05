import assert from 'node:assert/strict';
import { checkoutHandler } from '../functions/api/checkout/stripe-handler';
const origin = 'https://store.example';
const env = { STRIPE_PUBLISHABLE_KEY: 'pk_test_fixture', STRIPE_SECRET_KEY: 'sk_test_fixture' };
const request = (path: string, body?: unknown, source = origin) => new Request(origin + '/api/checkout/' + path,
  body === undefined ? {} : { method: 'POST', headers: { Origin: source }, body: JSON.stringify(body) });
assert.equal((await checkoutHandler({ request: request('config'), env: {} }).then(r => r.json())).isConfigured, false);
assert.equal((await checkoutHandler({ request: request('config'), env: {
  STRIPE_PUBLISHABLE_KEY: 'pk_live_fixture', STRIPE_SECRET_KEY: 'sk_live_fixture',
} }).then(r => r.json())).isConfigured, false);
assert.equal((await checkoutHandler({ request: request('create-session', { items: [] }), env })).status, 400);
assert.equal((await checkoutHandler({ request: request('create-session', { items: [{ id: 'kit_duo', quantity: -1 }] }), env })).status, 400);
assert.equal((await checkoutHandler({ request: request('create-session', { items: [{ id: '__proto__', quantity: 1 }] }), env })).status, 400);
assert.equal((await checkoutHandler({ request: request('create-session', { items: [{ id: 'single', quantity: 1 }] }, 'https://attacker.example'), env })).status, 403);
let payload: URLSearchParams;
globalThis.fetch = (async (_input, init) => {
  payload = init!.body as URLSearchParams;
  return new Response(JSON.stringify({ id: 'cs_test_fixture', client_secret: 'test_secret' }));
}) as typeof fetch;
const response = await checkoutHandler({ request: request('create-session', { items: [{ id: 'kit_duo', quantity: 1, unitPrice: 1 }] }), env });
assert.equal(response.status, 200);
assert.equal(payload!.get('line_items[0][price_data][unit_amount]'), '3499');
assert.equal(payload!.get('ui_mode'), 'embedded');
assert.equal(payload!.get('redirect_on_completion'), 'never');
assert.equal(payload!.get('shipping_address_collection[allowed_countries][0]'), 'US');
const session = await response.json();
globalThis.fetch = (async () => new Response(JSON.stringify({ payment_status: 'paid', status: 'complete', metadata: { verification_token: session.verificationToken } }))) as typeof fetch;
const statusUrl = origin + '/api/checkout/session-status?session_id=cs_test_fixture';
assert.equal((await checkoutHandler({ request: new Request(statusUrl, { headers: { 'X-Checkout-Token': 'wrong' } }), env })).status, 403);
assert.equal((await checkoutHandler({ request: new Request(statusUrl, { headers: { 'X-Checkout-Token': session.verificationToken } }), env }).then(r => r.json())).paymentStatus, 'paid');
console.log('Pages checkout: validation, server prices, embedded mode and buyer authorization passed.');
