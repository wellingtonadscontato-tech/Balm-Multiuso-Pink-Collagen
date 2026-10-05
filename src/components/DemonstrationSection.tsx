/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Clock, Moon, Sparkles } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import applicationImage from '../assets/images/rosa_balm_application_1791199941551.jpg';

export const DemonstrationSection: React.FC = () => {
  const periodIcons = [Sun, Clock, Moon];

  return (
    <section id="demonstracao" className="py-16 sm:py-24 bg-[#FAF5F7] border-b border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Art 07 Showcase (Portability & On-the-Go) with object-fit contain */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-[#FFF5F7] p-2 flex flex-col items-center">
              <div className="aspect-3/4 sm:aspect-4/5 w-full relative flex items-center justify-center bg-white rounded-2xl p-2">
                <img
                  src="/assets/07-art-en.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== applicationImage) {
                      target.src = applicationImage;
                    }
                  }}
                  alt="Art 07: Perfect for On-the-Go - Compact, travel-friendly and easy to use anytime, anywhere"
                  className="w-full h-full object-contain object-center rounded-xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Discrete Arte ilustrativa label */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-rose-100/80 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-[11px] font-medium text-stone-700">
                    Arte ilustrativa baseada na referência do produto
                  </span>
                </div>
              </div>

              {/* Discreet Quote / Note */}
              <div className="p-4 w-full bg-white border-t border-rose-100 rounded-b-2xl mt-2">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-0.5">
                  Art 07 · Portabilidade
                </div>
                <p className="text-xs text-stone-600">
                  Formato compacto de 10g ideal para viagem, academia, trabalho e retoques diários.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Routine Steps */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Momentos de Uso</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
              {productConfig.routine.title}
            </h2>
            <p className="text-base text-stone-600 mb-8 leading-relaxed">
              {productConfig.routine.subtitle}
            </p>

            <div className="space-y-4">
              {productConfig.routine.moments.map((moment, idx) => {
                const Icon = periodIcons[idx] || Sun;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-rose-100 hover:border-rose-200 shadow-xs transition-all flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                          {moment.period}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900">
                          {moment.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {moment.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
