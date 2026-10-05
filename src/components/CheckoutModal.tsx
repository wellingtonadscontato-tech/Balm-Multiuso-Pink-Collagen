/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, AlertCircle, Truck, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productConfig } from '../config/productConfig';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, items, total } = useCart();

  if (!isCheckoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeCheckoutModal}
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 z-10 animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeCheckoutModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Fechar aviso de checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Módulo de Checkout Desconectado
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              Vendas em Homologação
            </h3>
          </div>
        </div>

        {/* Informative Explanation */}
        <div className="p-4 rounded-2xl bg-[#FAF6F7] border border-rose-100 mb-5 text-xs text-stone-600 space-y-2">
          <p className="font-medium text-stone-800">
            Agradecemos pelo interesse no <span className="text-rose-600 font-bold">{productConfig.brand.name}</span>!
          </p>
          <p>
            {productConfig.disclaimers.prototypeNotice}
          </p>
          <p className="text-stone-500">
            Nenhuma cobrança foi efetuada e nenhum dado financeiro ou de cartão de crédito foi coletado.
          </p>
        </div>

        {/* Summary of Items configured */}
        <div className="mb-5 border border-stone-100 rounded-2xl p-4 bg-stone-50/50 text-xs">
          <div className="font-semibold text-stone-800 mb-2">Resumo da seleção de teste:</div>
          <div className="space-y-1.5 mb-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-600">
                <span>
                  {item.quantity}x {item.title} ({item.unitWeight})
                </span>
                <span className="font-medium tabular-nums">
                  ${(item.unitPrice * item.quantity).toFixed(2)} USD
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-700">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Truck className="w-3.5 h-3.5" />
              Frete EUA: Grátis ($0.00)
            </span>
            <span className="text-sm font-bold text-stone-900 tabular-nums">
              Total: ${total.toFixed(2)} USD
            </span>
          </div>

          <div className="mt-2 text-[11px] text-stone-400 italic">
            * Prazo de entrega a confirmar.
          </div>
        </div>

        {/* Store Independent Disclaimer */}
        <div className="p-3 rounded-xl bg-stone-100/70 border border-stone-200/60 text-[10px] text-stone-500 leading-relaxed mb-5 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>{productConfig.brand.storeDisclaimer}</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={closeCheckoutModal}
          className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs"
        >
          Entendido, voltar à página
        </button>
      </div>
    </div>
  );
};
