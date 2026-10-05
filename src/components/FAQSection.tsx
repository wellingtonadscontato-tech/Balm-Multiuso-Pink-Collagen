/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-16 sm:py-24 bg-[#FAF5F7] border-b border-rose-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Transparência & Informações</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            {productConfig.faq.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            {productConfig.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {productConfig.faq.questions.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-rose-100 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <span className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-rose-100' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-50">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
