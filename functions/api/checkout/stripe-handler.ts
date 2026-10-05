interface Env { STRIPE_PUBLISHABLE_KEY?: string; STRIPE_SECRET_KEY?: string; }
const prices: Record<string, number> = { single: 2499, kit_duo: 3499, kit_quad: 5999 };
const names: Record<string, string> = { single: '1 Stick (10g)', kit_duo: '2 Sticks (20g)', kit_quad: '4 Sticks (40g)' };
const images: Record<string, string> = { single: 'product-isolated.png', kit_duo: 'product-kit-2.png', kit_quad: 'product-kit-4.png' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
// Only sandbox payments are permitted until durable fulfillment is verified.
export const checkoutHandler = async ({ request, env }: { request: Request; env: Env }) => {
  const url = new URL(request.url);
  const configured = Boolean(env.STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') && env.STRIPE_SECRET_KEY?.startsWith('sk_test_'));
  if (url.pathname.endsWith('/config') && request.method === 'GET') return json({
    publishableKey: configured ? env.STRIPE_PUBLISHABLE_KEY : '', isConfigured: configured,
    isShopifyConfigured: false, shopifyFallbackEnabled: false, mode: 'test' });
  if (!configured) return json({ message: 'Online checkout is temporarily unavailable.' }, 503);
  const api = async (path: string, body?: URLSearchParams) => {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions${path}`, {
      method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Stripe-Version': '2024-06-20', ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) }, body });
    if (!response.ok) throw new Error('Stripe request failed');
    return response.json() as Promise<any>;
  };
  try {
    if (url.pathname.endsWith('/create-session') && request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) return json({ message: 'Invalid origin.' }, 403);
      const raw = await request.text();
      if (raw.length > 4096) return json({ message: 'Invalid cart.' }, 400);
      let items: any;
      try { items = JSON.parse(raw).items; } catch { return json({ message: 'Invalid cart.' }, 400); }
      if (!Array.isArray(items) || !items.length || items.length > 3 || items.some(i =>
        !i || !Object.hasOwn(prices, i.id) || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 10) ||
        new Set(items.map(i => i.id)).size !== items.length) return json({ message: 'Invalid cart.' }, 400);
      const token = crypto.randomUUID() + crypto.randomUUID();
      const form = new URLSearchParams({ mode: 'payment', ui_mode: 'embedded', redirect_on_completion: 'never',
        'payment_method_types[0]': 'card', 'shipping_address_collection[allowed_countries][0]': 'US',
        'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
        'shipping_options[0][shipping_rate_data][fixed_amount][amount]': '0',
        'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
        'shipping_options[0][shipping_rate_data][display_name]': 'Free US shipping',
        'metadata[verification_token]': token, 'metadata[items_json]': JSON.stringify(items) });
      items.forEach((item: any, index: number) => {
        const prefix = `line_items[${index}]`;
        form.set(`${prefix}[quantity]`, String(item.quantity));
        form.set(`${prefix}[price_data][currency]`, 'usd');
        form.set(`${prefix}[price_data][unit_amount]`, String(prices[item.id]));
        form.set(`${prefix}[price_data][product_data][name]`, `Pink Collagen Multi Balm — ${names[item.id]}`);
        form.set(`${prefix}[price_data][product_data][images][0]`, `https://lpgzamgqjcoicmostfln.supabase.co/storage/v1/object/public/product-artwork/${images[item.id]}`);
      });
      const session = await api('', form);
      return json({ clientSecret: session.client_secret, sessionId: session.id, verificationToken: token });
    }
    if (url.pathname.endsWith('/session-status') && request.method === 'GET') {
      const id = url.searchParams.get('session_id') || '';
      const token = request.headers.get('X-Checkout-Token') || '';
      if (!/^cs_test_[A-Za-z0-9]+$/.test(id) || !token) return json({ message: 'Invalid session.' }, 400);
      const session = await api(`/${encodeURIComponent(id)}`);
      if (session.metadata?.verification_token !== token) return json({ message: 'Access denied.' }, 403);
      return json({ paymentStatus: session.payment_status, status: session.status, mode: 'test' });
    }
    return json({ message: 'Not found.' }, 404);
  } catch { return json({ message: 'Payment service unavailable. Please try again later.' }, 502); }
};
