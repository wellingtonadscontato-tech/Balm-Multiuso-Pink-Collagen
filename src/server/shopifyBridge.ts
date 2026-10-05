/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidatedLineItem } from './pricing';
import type Stripe from 'stripe';

export interface ShopifyBridgeResult {
  success: boolean;
  pendingCredentials?: boolean;
  shopifyOrderId?: number;
  shopifyOrderName?: string;
  error?: string;
}

export interface ShopifyBridgeOptions {
  storeDomain?: string;
  adminApiToken?: string;
}

export async function bridgeStripeSessionToShopify(
  session: Stripe.Checkout.Session,
  validatedItems: ValidatedLineItem[],
  options?: ShopifyBridgeOptions
): Promise<ShopifyBridgeResult> {
  const storeDomain =
    options?.storeDomain || process.env.SHOPIFY_STORE_DOMAIN || '6u0kc1-nm.myshopify.com';
  const adminApiToken = options?.adminApiToken || process.env.SHOPIFY_ADMIN_API_TOKEN;

  // If Shopify Admin API Token is not configured in environment:
  if (!adminApiToken) {
    return {
      success: false,
      pendingCredentials: true,
      error:
        'SHOPIFY_ADMIN_API_TOKEN not configured in server environment. Order captured and stored locally; awaiting Shopify credential setup.',
    };
  }

  const shipping = (
    session as unknown as {
      shipping_details?: {
        name?: string;
        address?: {
          country?: string;
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postal_code?: string;
        };
      };
    }
  ).shipping_details;
  const customer = session.customer_details;

  // Validate USA address requirement
  if (!shipping?.address?.country || shipping.address.country.toUpperCase() !== 'US') {
    return {
      success: false,
      error: `Order shipping address is not USA. Country received: ${shipping?.address?.country}`,
    };
  }

  // Construct official Shopify Order payload
  const line_items = validatedItems.map((item) => ({
    variant_id: Number(item.tier.variantId),
    quantity: item.quantityKits, // Strictly number of KITS of that variant
    price: item.tier.formattedPrice,
    title: item.tier.title,
    requires_shipping: true,
  }));

  const totalAmountUsd = ((session.amount_total || 0) / 100).toFixed(2);

  const orderPayload = {
    order: {
      email: customer?.email || session.customer_email || undefined,
      phone: customer?.phone || undefined,
      financial_status: 'paid',
      // Note: fulfillment_status MUST remain null/unfulfilled so DSers/fulfillment apps can process
      fulfillment_status: null,
      currency: 'USD',
      note: `Paid via Stripe Embedded Checkout. Stripe Session ID: ${session.id}`,
      tags: 'stripe-embedded,ai-studio,usa-free-shipping',
      line_items,
      shipping_lines: [
        {
          code: 'FREE_SHIPPING_USA',
          title: 'Free Standard Shipping (United States)',
          price: '0.00',
        },
      ],
      shipping_address: {
        first_name: shipping.name?.split(' ')[0] || 'Customer',
        last_name: shipping.name?.split(' ').slice(1).join(' ') || '',
        address1: shipping.address.line1 || '',
        address2: shipping.address.line2 || '',
        city: shipping.address.city || '',
        province: shipping.address.state || '',
        zip: shipping.address.postal_code || '',
        country: 'United States',
        country_code: 'US',
        phone: customer?.phone || undefined,
      },
      customer: {
        first_name: customer?.name?.split(' ')[0] || 'Customer',
        last_name: customer?.name?.split(' ').slice(1).join(' ') || '',
        email: customer?.email || session.customer_email,
      },
      transactions: [
        {
          kind: 'sale',
          status: 'success',
          amount: totalAmountUsd,
          currency: 'USD',
          gateway: 'stripe',
        },
      ],
    },
  };

  try {
    const url = `https://${storeDomain}/admin/api/2024-01/orders.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiToken,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseData = (await response.json()) as {
      order?: { id: number; name: string };
      errors?: unknown;
    };

    if (!response.ok || !responseData.order) {
      const errDetail =
        typeof responseData.errors === 'string'
          ? responseData.errors
          : JSON.stringify(responseData.errors || 'Unknown Shopify API error');
      return {
        success: false,
        error: `Shopify Order API responded with HTTP ${response.status}: ${errDetail}`,
      };
    }

    return {
      success: true,
      shopifyOrderId: responseData.order.id,
      shopifyOrderName: responseData.order.name,
    };
  } catch (err) {
    return {
      success: false,
      error: `Network error connecting to Shopify API: ${(err as Error).message}`,
    };
  }
}
