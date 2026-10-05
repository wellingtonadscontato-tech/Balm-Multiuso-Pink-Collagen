/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const HowToUseSection: React.FC = () => {
  return (
    <section id="como-usar" className="py-16 sm:py-24 bg-white border-b border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Orientação de Uso</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            {productConfig.howToUse.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            {productConfig.howToUse.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {productConfig.howToUse.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#FAF6F7] border border-rose-100 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 font-extrabold text-lg flex items-center justify-center mb-5 border border-rose-100 shadow-xs tabular-nums">
                  {step.number}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < 2 && (
                <div className="hidden md:flex justify-end pt-4 text-rose-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
