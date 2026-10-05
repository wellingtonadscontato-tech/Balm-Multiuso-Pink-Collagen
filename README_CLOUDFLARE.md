# Cloudflare Pages deployment

Build: `npm run build`; output: `dist`; branch: `main`.
The Pages checkout API supports Stripe Embedded Checkout in TEST MODE. Configure protected Pages variables `STRIPE_PUBLISHABLE_KEY=pk_test_…` and `STRIPE_SECRET_KEY=sk_test_…`, then redeploy. Never commit secrets. The Express server is not run by Pages.

The server fixes USD prices at $24.99, $34.99 and $59.99, collects US shipping addresses with free shipping, and uses official Stripe card fields. Completion is verified against Stripe using a private session token. Test payments do not create Shopify orders or shipments. Live keys are rejected.

Live embedded payments are NOT implemented for Pages yet. Before activation, implement and validate a durable order ledger, verified Stripe webhooks and Shopify order bridge in Pages Functions. The existing PostgreSQL adapter is only a specification, not an implemented adapter. Do not enable production simply by adding keys.

Domain: balmmultiusopinkcollagen.shop. Preserve all mail MX, SPF, DKIM and verification records when changing DNS. Add the domain through the Pages dashboard before changing DNS; use only the records provided for this project.

Contact: contato@balmmultiusopinkcollagen.shop.
