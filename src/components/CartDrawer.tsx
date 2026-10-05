/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
    openCheckoutModal,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
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
                  {totalCount} {totalCount === 1 ? 'kit selecionado' : 'kits selecionados'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors"
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
                >
                  Explorar Ofertas
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        {item.badge && (
                          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                            {item.badge}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <div className="text-xs text-stone-500 tabular-nums">
                          ${item.unitPrice.toFixed(2)} USD cada ({item.unitWeight})
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Steppers */}
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
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
                ))}
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
                <div className="flex justify-between items-center text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Frete para EUA
                  </span>
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Grátis ($0.00)
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                  <span>Prazo de entrega</span>
                  <span className="italic">Prazo a confirmar</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-rose-600 tabular-nums">
                    ${total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={openCheckoutModal}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Módulo de compra em revisão preliminar</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
