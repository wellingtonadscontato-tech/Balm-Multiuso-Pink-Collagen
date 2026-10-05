/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Truck } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-rose-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#FFF5F7] to-[#FAF2F5] border border-rose-200/80 shadow-sm relative overflow-hidden">
          {/* Subtle light accent */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-48 h-48 bg-rose-200/40 rounded-full blur-2xl pointer-events-none"
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{productConfig.brand.name}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
              Pronta para conhecer a proposta do Rosa Balm?
            </h2>

            <p className="text-sm sm:text-base text-stone-600 mb-8 leading-relaxed">
              Praticidade em formato bastão com foco em hidratação e aparência luminosa para o mercado dos Estados Unidos.
            </p>

            <a
              href="#ofertas"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all text-center whitespace-nowrap"
            >
              {productConfig.hero.ctaButton}
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-rose-600" />
                Frete Grátis nos EUA
              </span>
              <span aria-hidden="true">·</span>
              <span>Prazo de entrega a confirmar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
