/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers, AlertCircle, Info } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const ProductGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gallery = productConfig.gallery;
  const currentItem = gallery[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Main Image Stage - object-fit contain so no card content is clipped */}
      <div className="relative aspect-3/4 sm:aspect-4/5 md:aspect-3/4 w-full rounded-3xl overflow-hidden bg-rose-50/50 border border-rose-100 shadow-lg shadow-rose-950/5 flex items-center justify-center p-2 group">
        <img
          src={currentItem.src}
          onError={(e) => {
            // Graceful fallback to persistent backup asset if external file is missing
            const target = e.target as HTMLImageElement;
            if (target.src !== currentItem.fallbackSrc) {
              target.src = currentItem.fallbackSrc;
            }
          }}
          alt={currentItem.alt}
          className="w-full h-full object-contain object-center transition-all duration-300 rounded-2xl"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Top-Right Badge: Slide Counter (1 of 9) */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full tabular-nums">
            {currentIndex + 1} / {gallery.length}
          </span>
          <span className="bg-white/95 backdrop-blur-md text-stone-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-rose-100 hidden xs:inline-block">
            {currentItem.tag}
          </span>
        </div>

        {/* Comparison Disclaimer for Arte 6 */}
        {currentItem.isComparisonArte6 && (
          <div className="absolute top-4 left-4 right-20 bg-amber-500/90 text-white backdrop-blur-md text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Comparação ilustrativa de layout; não representa resultado clínico ou depoimento validado</span>
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Imagem anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md border border-stone-200/60 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Próxima imagem"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md border border-stone-200/60 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Discrete Bottom Note under Active Image */}
      <div className="px-1 text-left flex items-start gap-1.5 text-[11px] text-stone-500">
        <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <span>{productConfig.disclaimers.arteNotice}</span>
      </div>

      {/* 9-Thumbnail Carousel/Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-rose-200">
        {gallery.map((art, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={art.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative shrink-0 w-13 h-16 sm:w-15 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white p-0.5 ${
                isActive
                  ? 'border-rose-600 ring-2 ring-rose-400/30 shadow-sm scale-102'
                  : 'border-rose-100 hover:border-rose-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={art.src}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== art.fallbackSrc) {
                    target.src = art.fallbackSrc;
                  }
                }}
                alt={art.alt}
                className="w-full h-full object-contain rounded-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-stone-900/80 px-1 rounded tabular-nums">
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
