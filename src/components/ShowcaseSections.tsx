/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Check, Heart, Feather, MapPin } from 'lucide-react';
import { productConfig } from '../config/productConfig';

export const ShowcaseSections: React.FC = () => {
  const { assets } = productConfig;

  return (
    <div id="beneficios" className="space-y-16 sm:space-y-24 py-12 sm:py-16">
      {/* 1. Arte 02: Aplicação / Glides On Smoothly */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Aplicação Suave</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Deslize suave que derrete em contato com a pele
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              A textura emoliente em bastão foi desenvolvida para aplicação direta e confortável, proporcionando acabamento hidratado e luminoso sem sensação pesada ou pegajosa.
            </p>
            <div className="space-y-3 w-full max-w-md">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Deslize direto sem puxar ou agredir áreas delicadas da pele</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Toque aveludado e absorção equilibrada para o dia todo</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.applicationArt}
                alt="Glides On Smoothly - A lightweight non-greasy balm"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Arte 04: Áreas de Aplicação / Multi-Use Balm Areas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.areasArt}
                alt="Multi-Use Balm Areas: Under eyes, forehead, cheeks, smile lines, neck, lips"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Cuidado Direcionado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Um só bastão para múltiplas áreas do rosto e corpo
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              O formato anatômico permite alcançar com facilidade regiões propensas ao ressecamento e às linhas finas, adaptando-se com precisão à sua rotina facial.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {['Abaixo dos olhos', 'Bochechas', 'Linhas do sorriso', 'Testa', 'Pescoço e colo', 'Ao redor dos lábios'].map((area, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-rose-100 text-stone-800 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Arte 05: Destaque de Produto & Embalagem / Pink Collagen Balm Splash */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Fórmula & Textura</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Hidratação profunda com tecnologia coreana em bastão
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              O bálsamo une PDRN, colágeno rosa e Volufiline 5% para proporcionar cuidado intensivo contra a perda de elasticidade e o ressecamento, conferindo luminosidade imediata.
            </p>
            <div className="space-y-3 w-full max-w-md">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Sensação de frescor e viço natural sem oleosidade excessiva</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Embalagem retrátil com tampa protetora de fechamento seguro</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.productArt}
                alt="Medicube 5% Volufiline PDRN Pink Collagen Volume Multi Balm stick with water splash"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Arte 07: Portabilidade / Perfect for On-the-Go */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.portabilityArt}
                alt="Perfect for On-the-Go: Compact, travel-friendly and easy to use anytime, anywhere"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Feather className="w-3.5 h-3.5 text-rose-500" />
              <span>Portabilidade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Leve na bolsa, no trabalho ou na viagem
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              Com apenas 10g e formato compacto, você renova o viço e a hidratação a qualquer hora do dia sem precisar de espelho ou aplicação com as mãos.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100">
                <div className="text-xs font-bold text-stone-900 mb-0.5">Viagens & Voos</div>
                <div className="text-[11px] text-stone-500">Combate o ar seco de cabines</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100">
                <div className="text-xs font-bold text-stone-900 mb-0.5">Dia a Dia & Trabalho</div>
                <div className="text-[11px] text-stone-500">Retoques rápidos entre reuniões</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100">
                <div className="text-xs font-bold text-stone-900 mb-0.5">Academia</div>
                <div className="text-[11px] text-stone-500">Hidratação imediata pós-treino</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-rose-100">
                <div className="text-xs font-bold text-stone-900 mb-0.5">Uso Noturno</div>
                <div className="text-[11px] text-stone-500">Cuidado extra antes de dormir</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Arte 08: Textura / A Silky, Lightweight Texture */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Sensorial Aveludado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Textura sedosa e leve que se funde naturalmente
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              A fórmula sólida se transforma em uma película emoliente protetora e macia, criando uma barreira contra o ressecamento diário com toque não pegajoso.
            </p>
            <div className="space-y-3 w-full max-w-md">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Fórmula livre de fragrâncias artificiais agressivas</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span>Acabamento radiante (glow) que realça o frescor da pele</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.textureArt}
                alt="A Silky, Lightweight Texture - Melts into skin without feeling sticky or greasy"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Arte 09 (v2): Rotina & Viço / Glow Anytime, Anywhere */}
      <section id="demonstracao" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-lg lg:max-w-xl sm:rounded-3xl overflow-hidden sm:shadow-lg flex items-center justify-center">
              <img
                src={assets.routineArt}
                alt="Glow Anytime, Anywhere - Simple, effective, beautifully you"
                className="w-full h-auto object-cover sm:object-contain block"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Viço a Qualquer Hora</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
              Simples, prático e natural em qualquer momento do dia
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
              Pode ser usado antes da sua maquiagem habitual como primer hidratante ou suavemente aplicado por cima para renovar o viço ao longo da tarde.
            </p>
            <div className="p-5 rounded-2xl bg-white border border-rose-100 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <span className="font-semibold text-stone-900 block mb-1">Dica de uso diário:</span>
              Gire a base para expor uma pequena quantidade de bastão, aplique delicadamente nas áreas desejadas e espalhe com leveza se necessário. Feche bem a tampa após cada uso.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
