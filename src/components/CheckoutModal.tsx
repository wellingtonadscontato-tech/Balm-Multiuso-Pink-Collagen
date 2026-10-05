/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productConfig } from '../config/productConfig';
import { shopifyCheckout } from '../config/shopifyCheckout';
import fallbackProductImg from '../assets/images/rosa_balm_hero_1791199906964.jpg';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, items, subtotal, total, totalSticksCount } =
    useCart();

  if (!isCheckoutModalOpen) return null;

  // Build the official Shopify cart permalink:
  // https://6u0kc1-nm.myshopify.com/cart/{variantId}:{quantity}?checkout&country=US
  const checkoutUrl = shopifyCheckout.buildCartPermalink(
    items.map((item) => ({ id: item.id, quantity: item.quantity }))
  );

  // Helper to resolve the correct photo and title for each kit
  const getItemDetails = (item: {
    id: 'single' | 'kit_duo' | 'kit_quad';
    quantity: number;
    unitPrice: number;
  }) => {
    if (item.id === 'single') {
      const title = item.quantity === 1 ? '1 Stick' : `${item.quantity} Sticks`;
      const image =
        item.quantity === 2
          ? productConfig.assets.productKit2
          : item.quantity >= 4
          ? productConfig.assets.productKit4
          : productConfig.assets.productIsolated;
      return {
        title,
        weight: `${item.quantity * 10}g total`,
        image,
        description: `${item.quantity}x individual (10g)`,
      };
    }

    if (item.id === 'kit_duo') {
      const title =
        item.quantity === 1
          ? 'Kit 2 Sticks (20g)'
          : `${item.quantity}x Kits 2 Sticks (${item.quantity * 2} Sticks total)`;
      return {
        title,
        weight: `${item.quantity * 20}g total`,
        image: productConfig.assets.productKit2,
        description: 'Kit em destaque · 2 unidades',
      };
    }

    // kit_quad
    const title =
      item.quantity === 1
        ? 'Kit 4 Sticks (40g)'
        : `${item.quantity}x Kits 4 Sticks (${item.quantity * 4} Sticks total)`;
    return {
      title,
      weight: `${item.quantity * 40}g total`,
      image: productConfig.assets.productKit4,
      description: 'Super Econômico · 4 unidades',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeCheckoutModal}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-rose-200/90 z-10 animate-scale-in my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeCheckoutModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Fechar resumo de compra"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-left mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>Resumo do Pedido</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Finalize sua compra
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Revise seus itens e prossiga para o ambiente oficial de pagamento da Shopify.
          </p>
        </div>

        {/* Product Items: Large visual display with official Supabase artwork */}
        <div className="space-y-3 mb-5">
          {items.map((item) => {
            const details = getItemDetails(item);

            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#FFF6F8] border border-rose-100"
              >
                {/* Large Product Image */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-white border border-rose-200/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                  <img
                    src={details.image}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== fallbackProductImg) {
                        target.src = fallbackProductImg;
                      }
                    }}
                    alt={details.title}
                    className="w-full h-full object-contain filter drop-shadow-xs"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-rose-700 mb-0.5">
                    {details.description}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {details.title}
                  </h4>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Quantidade:{' '}
                    <span className="font-semibold text-stone-800">{item.quantity}</span> kit
                    {item.quantity > 1 ? 's' : ''} ({details.weight})
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-stone-900 mt-1 tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)} USD
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Breakdown */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm space-y-2 mb-5">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900 tabular-nums">
              ${subtotal.toFixed(2)} USD
            </span>
          </div>

          <div className="flex justify-between items-center text-emerald-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Frete para os EUA
            </span>
            <span>Grátis ($0.00)</span>
          </div>

          <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline">
            <span className="font-bold text-stone-900 text-sm sm:text-base">Total</span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
                ${total.toFixed(2)} USD
              </span>
              <span className="block text-[11px] text-stone-500 font-normal">
                {totalSticksCount} {totalSticksCount === 1 ? 'bastão' : 'bastões'} inclusos
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Accessible direct link to Shopify Checkout in the SAME tab */}
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_self"
            rel="noopener"
            className="w-full py-4 px-5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] active:scale-[0.99] text-white text-sm sm:text-base font-bold transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 text-center cursor-pointer select-none"
          >
            <span>Continuar para pagamento na Shopify</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        ) : (
          <button
            type="button"
            onClick={closeCheckoutModal}
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-200 text-stone-600 text-sm font-semibold cursor-not-allowed"
            disabled
          >
            Selecione um kit antes de continuar
          </button>
        )}

        {/* Security & Guarantee Footer */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          <span>Checkout processado nos servidores seguros da Shopify Inc.</span>
        </div>
      </div>
    </div>
  );
};
