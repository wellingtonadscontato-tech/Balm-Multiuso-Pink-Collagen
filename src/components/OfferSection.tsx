/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import { useCart } from '../context/CartContext';
import fallbackProductImg from '../assets/images/rosa_balm_hero_1791199906964.jpg';

export const OfferSection: React.FC = () => {
  const { addItem, openDrawer } = useCart();
  const [selectedTier, setSelectedTier] = useState<'single' | 'kit_duo' | 'kit_quad'>('kit_duo');

  const { single, kitDuo, kitQuad } = productConfig.tiers;

  const handleSelectAndAdd = (tierId: 'single' | 'kit_duo' | 'kit_quad') => {
    setSelectedTier(tierId);
    addItem(tierId);
  };

  // Helper component to render physical isolated product sticks
  const renderSticks = (count: number) => {
    return (
      <div className="flex items-center justify-center gap-1.5 h-36 sm:h-44 py-2 my-2">
        {Array.from({ length: count }).map((_, i) => (
          <img
            key={i}
            src="/assets/product-isolated.png"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== fallbackProductImg) {
                target.src = fallbackProductImg;
              }
            }}
            alt={`Rosa Balm Stick ${i + 1}`}
            className={`h-full object-contain filter drop-shadow-md transition-transform ${
              count === 4 ? 'w-11 sm:w-14' : count === 2 ? 'w-16 sm:w-20' : 'w-20 sm:w-24'
            }`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>
    );
  };

  return (
    <section id="ofertas" className="py-14 sm:py-20 bg-[#FAF4F6] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header: Português "Escolha seu kit" com subtítulo curto */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2">
            Escolha seu kit
          </h2>
          <p className="text-sm text-stone-600">
            Mais praticidade para sua rotina, com Frete Grátis para todo o território dos Estados Unidos.
          </p>
        </div>

        {/* 3 Rosy Interactive Cards based on Card 10 layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: 1 Stick */}
          <div
            onClick={() => setSelectedTier('single')}
            className={`relative flex flex-col justify-between p-6 rounded-3xl transition-all cursor-pointer bg-[#FFF5F7] border ${
              selectedTier === 'single'
                ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-lg'
                : 'border-rose-200/80 hover:border-rose-300 shadow-xs'
            }`}
          >
            <div>
              <div className="text-center mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">1 Stick</h3>
                <span className="text-xs text-stone-500 font-medium">(10g)</span>
              </div>

              {/* Physical Product Display: 1 isolated stick */}
              {renderSticks(1)}

              {/* Price & Free Shipping */}
              <div className="text-center mt-3 mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tabular-nums">
                  ${single.price.toFixed(2)}
                </div>
                <div className="text-xs font-semibold text-rose-700 mt-0.5">
                  Free Shipping
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAdd('single');
                }}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  selectedTier === 'single'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                <span>{single.buttonText}</span>
              </button>
            </div>
          </div>

          {/* Card 2: 2 Sticks (FEATURED / KIT EM DESTAQUE) */}
          <div
            onClick={() => setSelectedTier('kit_duo')}
            className={`relative flex flex-col justify-between p-6 rounded-3xl transition-all cursor-pointer bg-[#FFF5F7] border ${
              selectedTier === 'kit_duo'
                ? 'border-rose-500 ring-2 ring-rose-500/35 shadow-xl shadow-rose-900/10'
                : 'border-rose-300 hover:border-rose-400 shadow-sm'
            }`}
          >
            {/* Top Pill: EXACTLY "Kit em destaque" (NO Mais Vendido, NO Most Popular) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-xs whitespace-nowrap">
              Kit em destaque
            </div>

            <div>
              <div className="text-center mb-1 pt-1">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">2 Sticks</h3>
                <span className="text-xs text-stone-500 font-medium">(20g total)</span>
              </div>

              {/* Physical Product Display: 2 separate isolated sticks */}
              {renderSticks(2)}

              {/* Price & Free Shipping */}
              <div className="text-center mt-3 mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tabular-nums">
                  ${kitDuo.price.toFixed(2)}
                </div>
                <div className="text-xs font-semibold text-rose-700 mt-0.5">
                  Free Shipping
                </div>
                <div className="text-[11px] text-stone-500 mt-1 tabular-nums">
                  {kitDuo.pricePerUnitText}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAdd('kit_duo');
                }}
                className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-md bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <span>{kitDuo.buttonText}</span>
              </button>
            </div>
          </div>

          {/* Card 3: 4 Sticks */}
          <div
            onClick={() => setSelectedTier('kit_quad')}
            className={`relative flex flex-col justify-between p-6 rounded-3xl transition-all cursor-pointer bg-[#FFF5F7] border ${
              selectedTier === 'kit_quad'
                ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-lg'
                : 'border-rose-200/80 hover:border-rose-300 shadow-xs'
            }`}
          >
            <div>
              <div className="text-center mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">4 Sticks</h3>
                <span className="text-xs text-stone-500 font-medium">(40g total)</span>
              </div>

              {/* Physical Product Display: 4 separate isolated sticks */}
              {renderSticks(4)}

              {/* Price & Free Shipping - Menor preço unitário */}
              <div className="text-center mt-3 mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tabular-nums">
                  ${kitQuad.price.toFixed(2)}
                </div>
                <div className="text-xs font-semibold text-rose-700 mt-0.5">
                  Free Shipping
                </div>
                <div className="text-[11px] text-stone-700 font-semibold mt-1 tabular-nums">
                  {kitQuad.pricePerUnitText}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAdd('kit_quad');
                }}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  selectedTier === 'kit_quad'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                <span>{kitQuad.buttonText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Free Shipping to the United States Box (Inspired by Card 10 bottom bar) */}
        <div className="mt-8 p-4 rounded-2xl bg-white/90 border border-rose-200/90 text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </span>
            <span className="font-semibold text-stone-900 text-xs sm:text-sm">
              Free Shipping to the United States
            </span>
          </div>

          <button
            type="button"
            onClick={openDrawer}
            className="text-rose-700 font-semibold hover:underline shrink-0"
          >
            Ver resumo no carrinho →
          </button>
        </div>
      </div>
    </section>
  );
};
