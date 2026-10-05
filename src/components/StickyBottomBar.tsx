/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Truck } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import { useCart } from '../context/CartContext';
import heroThumb from '../assets/images/rosa_balm_hero_1791199906964.jpg';

export const StickyBottomBar: React.FC = () => {
  const { totalSticksCount, openDrawer } = useCart();

  return (
    <div
      role="region"
      aria-label="Barra de compra rápida"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] py-2.5 px-4 transition-all"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Product preview thumbnail & price in US standard */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={productConfig.assets.productIsolated}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== heroThumb) {
                target.src = heroThumb;
              }
            }}
            alt="Rosa Balm - Imagem ilustrativa"
            title="Imagem ilustrativa"
            className="w-10 h-10 rounded-xl object-contain border border-rose-100 shrink-0 hidden xs:block bg-rose-50/50 p-0.5"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                {productConfig.brand.name} (10g)
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 hidden sm:inline-flex items-center gap-0.5">
                <Truck className="w-2.5 h-2.5" /> Frete Grátis EUA
              </span>
            </div>
            <div className="text-[11px] text-stone-500 truncate flex items-center gap-1.5">
              <span className="font-semibold text-stone-800 tabular-nums">
                1 un: $24.99
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-rose-700 font-medium tabular-nums">2 un: $34.99</span>
              <span aria-hidden="true" className="text-stone-300 hidden md:inline">·</span>
              <span className="text-stone-600 font-medium tabular-nums hidden md:inline">4 un: $59.99</span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Ver carrinho"
            className="p-2.5 rounded-xl border border-rose-200 text-stone-700 bg-white hover:text-rose-600 transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalSticksCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {totalSticksCount}
              </span>
            )}
          </button>

          <a
            href="#ofertas"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-semibold hover:bg-rose-700 shadow-xs active:scale-[0.98] transition-all whitespace-nowrap"
          >
            Comprar Agora
          </a>
        </div>
      </div>
    </div>
  );
};
