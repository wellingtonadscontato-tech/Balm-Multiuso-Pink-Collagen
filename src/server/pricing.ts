/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ValidTierId = 'single' | 'kit_duo' | 'kit_quad';

export interface ServerTierDefinition {
  id: ValidTierId;
  title: string;
  unitAmountCents: number; // In cents for Stripe
  formattedPrice: string;
  variantId: string; // Shopify Variant ID
  unitsPerKit: number;
  weight: string;
  imageUrl: string;
}

export const SERVER_TIERS: Record<ValidTierId, ServerTierDefinition> = {
  single: {
    id: 'single',
    title: 'Medicube PDRN Pink Collagen Volume Multi Balm - 1 Stick (10g)',
    unitAmountCents: 2499, // $24.99 USD
    formattedPrice: '24.99',
    variantId: '67629231046886',
    unitsPerKit: 1,
    weight: '10g',
    imageUrl:
      'https://lpgzamgqjcoicmostfln.supabase.co/storage/v1/object/public/product-artwork/product-isolated.png',
  },
  kit_duo: {
    id: 'kit_duo',
    title: 'Medicube PDRN Pink Collagen Volume Multi Balm - 2 Sticks Duo Kit (20g)',
    unitAmountCents: 3499, // $34.99 USD
    formattedPrice: '34.99',
    variantId: '67629231079654',
    unitsPerKit: 2,
    weight: '20g',
    imageUrl:
      'https://lpgzamgqjcoicmostfln.supabase.co/storage/v1/object/public/product-artwork/product-kit-2.png',
  },
  kit_quad: {
    id: 'kit_quad',
    title: 'Medicube PDRN Pink Collagen Volume Multi Balm - 4 Sticks Value Kit (40g)',
    unitAmountCents: 5999, // $59.99 USD
    formattedPrice: '59.99',
    variantId: '67629231112422',
    unitsPerKit: 4,
    weight: '40g',
    imageUrl:
      'https://lpgzamgqjcoicmostfln.supabase.co/storage/v1/object/public/product-artwork/product-kit-4.png',
  },
};

export interface ClientCartItemInput {
  id: string;
  quantity: number;
}

export interface ValidatedLineItem {
  tier: ServerTierDefinition;
  quantityKits: number;
  totalCents: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  items?: ValidatedLineItem[];
  totalAmountCents?: number;
}

/**
 * Authoritative Server Validation:
 * - Ensures items is non-empty array
 * - Whitelists IDs ('single', 'kit_duo', 'kit_quad')
 * - Ensures quantity is integer between 1 and 10 per kit
 * - Calculates totals strictly from authoritative server cents (no client price accepted)
 */
export function validateCartItems(rawItems: unknown): ValidationResult {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      isValid: false,
      error: 'Cart must contain at least one item.',
    };
  }

  const validated: ValidatedLineItem[] = [];
  let totalCents = 0;

  for (const item of rawItems) {
    if (!item || typeof item !== 'object') {
      return { isValid: false, error: 'Malformed item entry.' };
    }

    const id = (item as ClientCartItemInput).id;
    const quantity = (item as ClientCartItemInput).quantity;

    if (!id || typeof id !== 'string') {
      return { isValid: false, error: 'Missing item ID.' };
    }

    if (id !== 'single' && id !== 'kit_duo' && id !== 'kit_quad') {
      return {
        isValid: false,
        error: `Invalid tier ID "${id}". Allowed tiers: single, kit_duo, kit_quad.`,
      };
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return {
        isValid: false,
        error: `Quantity for "${id}" must be an integer between 1 and 10. Received: ${quantity}.`,
      };
    }

    const tier = SERVER_TIERS[id];
    const itemTotalCents = tier.unitAmountCents * quantity;

    validated.push({
      tier,
      quantityKits: quantity,
      totalCents: itemTotalCents,
    });

    totalCents += itemTotalCents;
  }

  return {
    isValid: true,
    items: validated,
    totalAmountCents: totalCents,
  };
}
