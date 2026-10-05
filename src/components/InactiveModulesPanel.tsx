/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ShieldAlert, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const InactiveModulesPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { orderBump, upsell, metaPixel } = productConfig.inactiveModules;

  return (
    <section className="py-8 bg-[#F5EEF0] border-y border-rose-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>Módulos de Conversão & Rastreamento em Prévia</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    Desativados
                  </span>
                </h4>
                <p className="text-[11px] text-stone-500">
                  Order Bump, Upsell e Meta Pixel estão estruturados de forma isolada e inativos até definição de catálogo e consentimento.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors self-start sm:self-auto shrink-0"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>{isOpen ? 'Ocultar detalhes técnicos' : 'Inspecionar status'}</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isOpen && (
            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Order Bump Module */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-800">{orderBump.name}</span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Inativo
                  </span>
                </div>
                <p className="text-stone-600 mb-2">{orderBump.description}</p>
                <div className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                  {orderBump.statusNote}
                </div>
              </div>

              {/* Upsell Module */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-800">{upsell.name}</span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Inativo
                  </span>
                </div>
                <p className="text-stone-600 mb-2">{upsell.description}</p>
                <div className="text-[11px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                  {upsell.statusNote}
                </div>
              </div>

              {/* Meta Pixel Tracker Module */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-stone-800">Meta Pixel</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Bloqueado
                  </span>
                </div>
                <p className="text-stone-600 mb-2">
                  Pixel ID: <code className="text-stone-700 font-mono">null</code>
                </p>
                <div className="text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200 space-y-1">
                  <div>• Evento Purchase: Bloqueado (sem simulação de compra).</div>
                  <div>• Requer consentimento de cookies antes de carregar script.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
