/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { productConfig } from '../config/productConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-10 px-4 sm:px-6 border-t border-stone-800 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Brand & Quick Nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                {productConfig.brand.name}
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider px-2 py-0.5 rounded bg-stone-800">
                Loja Independente
              </span>
            </div>
            <p className="text-stone-400 mt-1 text-xs max-w-md">
              {productConfig.brand.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-stone-400">
            <a href="#especificacoes" className="hover:text-rose-300 transition-colors">
              Especificações
            </a>
            <a href="#beneficios" className="hover:text-rose-300 transition-colors">
              Benefícios
            </a>
            <a href="#demonstracao" className="hover:text-rose-300 transition-colors">
              Rotina
            </a>
            <a href="#como-usar" className="hover:text-rose-300 transition-colors">
              Como Usar
            </a>
            <a href="#ofertas" className="hover:text-rose-300 transition-colors">
              Ofertas (USD)
            </a>
            <a href="#duvidas" className="hover:text-rose-300 transition-colors">
              FAQ
            </a>
          </nav>
        </div>

        {/* Copyright & Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>{productConfig.disclaimers.copyright}</div>
          <div className="flex items-center gap-3">
            <span>Moeda: USD ($)</span>
            <span>·</span>
            <span>Destino: Estados Unidos</span>
            <span>·</span>
            <span>Frete Grátis</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
