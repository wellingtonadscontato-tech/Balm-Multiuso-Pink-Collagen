/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShopifyVariantConfig {
  variantId: string;
  price: number;
  title: string;
}

export const shopifyCheckout = {
  domain: '6u0kc1-nm.myshopify.com',
  productId: '15402362994918',
  variants: {
    single: {
      variantId: '67629231046886',
      price: 24.99,
      title: '1 Stick',
    },
    kit_duo: {
      variantId: '67629231079654',
      price: 34.99,
      title: 'Kit 2 Sticks',
    },
    kit_quad: {
      variantId: '67629231112422',
      price: 59.99,
      title: 'Kit 4 Sticks',
    },
  },
  /**
   * Generates the Shopify cart permalink HTTPS URL:
   * https://6u0kc1-nm.myshopify.com/cart/{variantId}:{quantity},{variantId}:{quantity}?checkout&country=US
   *
   * Crucial rule: `quantity` represents the count of kits for that variant,
   * NOT the physical stick count. (e.g. 1 kit duo = 67629231079654:1).
   * Empty carts return null (no redirect).
   */
  buildCartPermalink: (
    items: { id: 'single' | 'kit_duo' | 'kit_quad'; quantity: number }[]
  ): string | null => {
    const validItems = items.filter((item) => item.quantity > 0);
    if (validItems.length === 0) return null;

    const parts = validItems.map((item) => {
      const variant = shopifyCheckout.variants[item.id];
      const variantId = variant ? variant.variantId : shopifyCheckout.variants.single.variantId;
      return `${variantId}:${item.quantity}`;
    });

    return `https://${shopifyCheckout.domain}/cart/${parts.join(',')}?checkout&country=US`;
  },
};
