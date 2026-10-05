# Cloudflare Pages deployment

Build: `npm run build`; output: `dist`; branch: `main`.
Static landing page and cart are ready for publication. The Pages checkout API intentionally returns `isConfigured: false` and rejects payment requests. The Express server is not run by Pages.

Live embedded payments are NOT implemented for Pages yet. Before activation, implement and validate a durable order ledger, verified Stripe webhooks and Shopify order bridge in Pages Functions. The existing PostgreSQL adapter is only a specification, not an implemented adapter. Do not enable production simply by adding keys.

Domain: balmmultiusopinkcollagen.shop. Preserve all mail MX, SPF, DKIM and verification records when changing DNS. Add the domain through the Pages dashboard before changing DNS; use only the records provided for this project.

Contact: contato@balmmultiusopinkcollagen.shop.
