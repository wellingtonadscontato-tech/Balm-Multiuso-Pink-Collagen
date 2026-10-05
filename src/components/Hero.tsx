/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, Check, Sparkles, Truck } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import { ProductGallery } from './ProductGallery';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-rose-100/60 bg-gradient-to-b from-[#FFF8F9] to-[#FAF5F7]">
      {/* Subtle organic ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-24 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{productConfig.hero.kicker}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500 font-normal">Multi Balm 10g</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] font-bold text-stone-900 leading-[1.15] tracking-tight mb-4 max-w-xl text-balance">
              {productConfig.hero.title.plainStart}
              <span className="text-rose-600 underline decoration-rose-300 decoration-wavy decoration-1 underline-offset-4">
                {productConfig.hero.title.highlight1}
              </span>
              {productConfig.hero.title.plainMiddle}
              <span className="text-rose-600 underline decoration-rose-300 decoration-wavy decoration-1 underline-offset-4">
                {productConfig.hero.title.highlight2}
              </span>
              {productConfig.hero.title.plainEnd}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-6 max-w-xl">
              {productConfig.hero.subtitle}
            </p>

            {/* Key Highlights */}
            <div className="flex flex-col gap-2.5 mb-7 w-full max-w-lg">
              {productConfig.hero.keyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Pricing Highlight Pill & CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-4">
              <a
                href="#ofertas"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all text-center whitespace-nowrap"
              >
                {productConfig.hero.ctaButton}
              </a>
              <a
                href="#especificacoes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-stone-700 bg-white/80 border border-stone-200 rounded-2xl hover:bg-white hover:border-rose-200 transition-all text-center whitespace-nowrap"
              >
                <span>{productConfig.hero.secondaryButton}</span>
                <ArrowDown className="w-4 h-4 text-stone-400" />
              </a>
            </div>

            {/* Quiet Unboxed Metadata (USD format & Free Shipping) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-stone-500">
              <span className="font-semibold text-stone-800">A partir de $24.99 USD</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Truck className="w-3 h-3" /> Frete Grátis (EUA)
              </span>
              <span aria-hidden="true">·</span>
              <span>Uso facial e corporal</span>
            </div>
          </div>

          {/* Right Column: Interactive 10-Image Gallery Configuration */}
          <div className="lg:col-span-6 flex justify-center">
            <ProductGallery />
          </div>
        </div>
      </div>
    </section>
  );
};
