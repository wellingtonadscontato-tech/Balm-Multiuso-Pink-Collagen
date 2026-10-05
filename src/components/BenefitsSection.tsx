/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Droplet, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import textureImage from '../assets/images/rosa_balm_texture_1791199926096.jpg';

export const BenefitsSection: React.FC = () => {
  const benefitIcons = [Droplet, Sparkles, Feather, ShieldCheck];

  return (
    <section id="beneficios" className="py-16 sm:py-24 bg-white border-b border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Proposta Cosmética</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            {productConfig.benefits.title}
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">
            {productConfig.benefits.subtitle}
          </p>
        </div>

        {/* Content: 4 Benefits Grid + Texture Showcase Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 4 Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productConfig.benefits.items.map((item, idx) => {
              const Icon = benefitIcons[idx] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#FAF6F7] border border-rose-100/80 hover:border-rose-200 transition-all flex flex-col justify-start"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 shadow-xs border border-rose-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Art 05 Showcase (Product & Splash) with object-fit contain */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-rose-100 bg-[#FFF5F7] p-2 flex flex-col items-center">
              <div className="aspect-3/4 sm:aspect-4/5 w-full relative flex items-center justify-center bg-white rounded-2xl p-2">
                <img
                  src="/assets/05-art-en.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== textureImage) {
                      target.src = textureImage;
                    }
                  }}
                  alt="Art 05: Medicube 5% Volufiline PDRN Pink Collagen Volume Multi Balm stick with water splash"
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
              <div className="p-5 w-full bg-white/95 backdrop-blur-xs border-t border-rose-100 rounded-b-2xl mt-2">
                <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                  Art 05 · Embalagem & Textura
                </div>
                <h4 className="text-base font-bold text-stone-900 mb-1">
                  Pink Collagen Balm Splash
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Fórmula com 5% Volufiline, PDRN e colágeno para hidratação e luminosidade com textura suave.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
