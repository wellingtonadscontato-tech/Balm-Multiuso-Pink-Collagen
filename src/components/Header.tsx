/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { productConfig } from '../config/productConfig';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const { totalSticksCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6F7]/90 backdrop-blur-md border-b border-rose-100/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-stone-900 hover:text-rose-600 transition-colors"
        >
          {productConfig.brand.name}
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <a href="#beneficios" className="hover:text-rose-600 transition-colors">
            Benefícios
          </a>
          <a href="#demonstracao" className="hover:text-rose-600 transition-colors">
            Rotina
          </a>
          <a href="#como-usar" className="hover:text-rose-600 transition-colors">
            Como Usar
          </a>
          <a href="#ofertas" className="hover:text-rose-600 transition-colors">
            Ofertas
          </a>
          <a href="#duvidas" className="hover:text-rose-600 transition-colors">
            Dúvidas
          </a>
        </nav>

        {/* Zone 3: Cart Action */}
        <div className="flex items-center gap-3">
          <a
            href="#ofertas"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 rounded-xl hover:bg-rose-100 transition-colors whitespace-nowrap"
          >
            Escolher Kit
          </a>

          <button
            type="button"
            onClick={openDrawer}
            aria-label="Abrir carrinho de compras"
            className="relative p-2.5 rounded-xl bg-white border border-rose-100 text-stone-700 hover:text-rose-600 hover:border-rose-200 transition-all shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-semibold hidden xs:inline">Carrinho</span>
            {totalSticksCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center animate-scale-in">
                {totalSticksCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
