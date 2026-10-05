/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import { productConfig } from '../config/productConfig';
import { shopifyCheckout } from '../config/shopifyCheckout';
import fallbackProductImg from '../assets/images/rosa_balm_hero_1791199906964.jpg';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    shippingTotal,
    total,
    totalCount,
    totalSticksCount,
    openCheckoutModal,
  } = useCart();

  if (!isDrawerOpen) return null;

  // Build the official Shopify cart permalink:
  // https://6u0kc1-nm.myshopify.com/cart/{variantId}:{quantity}?checkout&country=US
  const checkoutUrl = shopifyCheckout.buildCartPermalink(
    items.map((item) => ({ id: item.id, quantity: item.quantity }))
  );

  // Helper to dynamically calculate title, weight and matching image based on current quantity
  const getItemDetails = (item: CartItem) => {
    if (item.id === 'single') {
      const displayTitle = item.quantity === 1 ? '1 Stick' : `${item.quantity} Sticks`;
      const displayWeight = `${item.quantity * 10}g total`;
      const displayImage =
        item.quantity === 2
          ? productConfig.assets.productKit2
          : item.quantity >= 4
          ? productConfig.assets.productKit4
          : productConfig.assets.productIsolated;
      return {
        title: displayTitle,
        weight: displayWeight,
        image: displayImage,
        unitLabel: `$24.99 USD cada (10g)`,
      };
    }

    if (item.id === 'kit_duo') {
      const displayTitle =
        item.quantity === 1
          ? 'Kit 2 Sticks'
          : `${item.quantity * 2} Sticks (${item.quantity}x Kits Duo)`;
      const displayWeight = `${item.quantity * 20}g total`;
      return {
        title: displayTitle,
        weight: displayWeight,
        image: productConfig.assets.productKit2,
        unitLabel: `$34.99 USD cada kit (20g)`,
      };
    }

    // kit_quad
    const displayTitle =
      item.quantity === 1
        ? 'Kit 4 Sticks'
        : `${item.quantity * 4} Sticks (${item.quantity}x Kits Quad)`;
    const displayWeight = `${item.quantity * 40}g total`;
    return {
      title: displayTitle,
      weight: displayWeight,
      image: productConfig.assets.productKit4,
      unitLabel: `$59.99 USD cada kit (40g)`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-rose-100">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-rose-100 flex items-center justify-between bg-[#FAF6F7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-rose-600 border border-rose-100 flex items-center justify-center shadow-2xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Seu Carrinho</h3>
                <p className="text-xs text-stone-500">
                  {totalSticksCount}{' '}
                  {totalSticksCount === 1 ? 'bastão selecionado' : 'bastões selecionados'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items list or empty state */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="text-base font-bold text-stone-900 mb-1">
                  Seu carrinho está vazio
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Selecione 1 unidade ($24.99), Kit 2 unidades ($34.99) ou Kit 4 unidades ($59.99) com frete grátis para os Estados Unidos.
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Explorar Ofertas
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => {
                  const details = getItemDetails(item);

                  return (
                    <div key={item.id} className="pt-4 first:pt-0">
                      <div className="flex items-start gap-3 mb-2">
                        {/* Dynamic Product Thumbnail */}
                        <div className="w-16 h-18 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                          <img
                            src={details.image}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== fallbackProductImg) {
                                target.src = fallbackProductImg;
                              }
                            }}
                            alt={details.title}
                            className="w-full h-full object-contain filter drop-shadow-xs transition-transform"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {item.badge && (
                            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                              {item.badge}
                            </span>
                          )}
                          {/* Dynamic Title that updates when quantity changes */}
                          <h4 className="text-sm font-bold text-stone-900 truncate">
                            {details.title}
                          </h4>
                          <div className="text-xs text-stone-500 tabular-nums">
                            {details.unitLabel}
                          </div>
                          <div className="text-[11px] text-stone-600 font-medium mt-0.5">
                            Peso: {details.weight}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-50">
                        {/* Stepper with comfortable tap targets */}
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, -1);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-white active:bg-rose-100 rounded-lg transition-colors cursor-pointer select-none"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-stone-900 tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-white active:bg-rose-100 rounded-lg transition-colors cursor-pointer select-none"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-stone-900 tabular-nums">
                            ${(item.unitPrice * item.quantity).toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-emerald-600 font-medium">
                            Frete Grátis (EUA)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer: Financial breakdown & Checkout action */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-rose-100 bg-[#FAF6F7] space-y-4">
              {/* Financial Lines */}
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ${subtotal.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Frete para os EUA
                  </span>
                  <span>Grátis ($0.00)</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Total</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                      ${total.toFixed(2)} USD
                    </span>
                    <span className="block text-[10px] text-stone-600 font-normal">
                      Prazo de entrega a confirmar
                    </span>
                  </div>
                </div>
              </div>

              {/* Embedded Checkout Trigger Button */}
              {items.length > 0 ? (
                <button
                  type="button"
                  onClick={openCheckoutModal}
                  className="w-full py-4 px-5 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 text-center cursor-pointer select-none"
                >
                  <span>Finalizar Pedido</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl bg-stone-200 text-stone-500 text-sm font-semibold cursor-not-allowed"
                >
                  Selecione um kit antes de continuar
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>Compra protegida com entrega em todos os estados dos EUA</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
