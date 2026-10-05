/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Check, AlertTriangle, ShieldCheck, MapPin, Package, HeartHandshake } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const ProductAccordion: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    benefits: true,
    areas: false,
    usage: false,
    precautions: false,
  });

  const toggle = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const { productDetails, brand } = productConfig;

  return (
    <div id="especificacoes" className="w-full bg-white rounded-3xl border border-rose-100/90 shadow-sm p-5 sm:p-7">
      {/* Header */}
      <div className="mb-6 pb-5 border-b border-stone-100">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Detalhes do Produto</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
          Especificações do Produto ({brand.referenceProduct})
        </h3>

      </div>

      <div className="space-y-3">
        {/* 1. Visão Geral & Fórmula */}
        <div className="rounded-2xl border border-rose-100 overflow-hidden bg-[#FAF6F7]/60">
          <button
            type="button"
            onClick={() => toggle('overview')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                Visão Geral & Complexo de Ativos
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transition-transform ${
                openSections.overview ? 'rotate-180 text-rose-600' : ''
              }`}
            />
          </button>

          {openSections.overview && (
            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-rose-100/60 bg-white">
              <p className="mb-4">
                {productDetails.overview}
              </p>

              {/* Tag pills for ingredients */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Ativos destacados na fórmula:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {productDetails.formulaHighlights.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-100"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Benefícios */}
        <div className="rounded-2xl border border-rose-100 overflow-hidden bg-[#FAF6F7]/60">
          <button
            type="button"
            onClick={() => toggle('benefits')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                <Check className="w-4 h-4" />
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                Benefícios do Produto
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transition-transform ${
                openSections.benefits ? 'rotate-180 text-rose-600' : ''
              }`}
            />
          </button>

          {openSections.benefits && (
            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-rose-100/60 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {productDetails.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span className="text-stone-700">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Áreas de Aplicação */}
        <div className="rounded-2xl border border-rose-100 overflow-hidden bg-[#FAF6F7]/60">
          <button
            type="button"
            onClick={() => toggle('areas')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                Áreas de Aplicação Recomendadas
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transition-transform ${
                openSections.areas ? 'rotate-180 text-rose-600' : ''
              }`}
            />
          </button>

          {openSections.areas && (
            <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-rose-100/60 bg-white">
              <p className="text-xs text-stone-500 mb-3">
                O formato em bastão permite aplicação direcionada e precisa nas seguintes regiões faciais e corporais:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {productDetails.applicationAreas.map((area, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-stone-800 text-xs font-medium flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Modo de Uso */}
        <div className="rounded-2xl border border-rose-100 overflow-hidden bg-[#FAF6F7]/60">
          <button
            type="button"
            onClick={() => toggle('usage')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                Modo de Uso
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transition-transform ${
                openSections.usage ? 'rotate-180 text-rose-600' : ''
              }`}
            />
          </button>

          {openSections.usage && (
            <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-rose-100/60 bg-white">
              <div className="p-3.5 rounded-xl bg-[#FAF6F7] border border-rose-100 text-stone-800 font-medium">
                {productDetails.usageInstructions}
              </div>
            </div>
          )}
        </div>

        {/* 5. Precauções & Conteúdo */}
        <div className="rounded-2xl border border-rose-100 overflow-hidden bg-[#FAF6F7]/60">
          <button
            type="button"
            onClick={() => toggle('precautions')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                <Package className="w-4 h-4" />
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-900">
                Precauções & Conteúdo
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transition-transform ${
                openSections.precautions ? 'rotate-180 text-rose-600' : ''
              }`}
            />
          </button>

          {openSections.precautions && (
            <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-rose-100/60 bg-white space-y-3">
              <div className="flex items-start gap-2.5 text-stone-600">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-800">Precauções: </strong>
                  {productDetails.precautions}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-600 pt-2 border-t border-stone-100">
                <Package className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-800">Conteúdo líquido: </strong>
                  {productDetails.packageContent}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
