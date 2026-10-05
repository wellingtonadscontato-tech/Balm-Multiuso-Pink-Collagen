// Payment activation requires a separately verified server integration.
// Never expose API secrets or allow an incomplete payment/order flow.
export const onRequest = async ({ request }: { request: Request }) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (new URL(request.url).pathname === '/api/checkout/config' && request.method === 'GET') {
    return new Response(JSON.stringify({
      publishableKey: '', isConfigured: false, isShopifyConfigured: false,
      shopifyDomain: '6u0kc1-nm.myshopify.com', shopifyFallbackEnabled: false,
    }), { headers });
  }
  return new Response(JSON.stringify({ message: 'Online checkout is temporarily unavailable.' }), { status: 503, headers });
};
