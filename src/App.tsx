/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OfferSection } from './components/OfferSection';
import { ShowcaseSections } from './components/ShowcaseSections';
import { HowToUseSection } from './components/HowToUseSection';
import { ProductAccordion } from './components/ProductAccordion';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { EmbeddedCheckoutModal } from './components/EmbeddedCheckoutModal';
import { StickyBottomBar } from './components/StickyBottomBar';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FAF6F7] text-stone-800 flex flex-col selection:bg-rose-200 selection:text-rose-900 pb-20 sm:pb-24">
        {/* Top Navigation */}
        <Header />

        <main className="flex-1">
          {/* 1. Hero: Apresentação com imagem grande destacada (Arte 01) sem carrossel */}
          <Hero />

          {/* 2. Kits de Oferta Interativa (Cards 1, 2, 4 com bastões ~240px e gap zero) */}
          <OfferSection />

          {/* 3. Artes Grandes Distribuídas pelas seções (Arte 02, Arte 04, Arte 05, Arte 07, Arte 08, Arte 09 v2) */}
          <ShowcaseSections />

          {/* 4. Modo de Uso Recomendado */}
          <HowToUseSection />

          {/* 5. Ingredientes Poderosos (Arte 03) + Ficha Técnica Expansível antes do FAQ */}
          <section className="py-12 sm:py-16 bg-white/70 border-y border-rose-100/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <ProductAccordion />
            </div>
          </section>

          {/* 6. FAQ Section */}
          <FAQSection />

          {/* 7. Final Call to Action */}
          <FinalCTA />
        </main>

        {/* Rodapé Limpo */}
        <Footer />

        {/* Carrinho Lateral com miniatura real do produto isolado em cada linha */}
        <CartDrawer />

        {/* Modal de Checkout Incorporado Stripe Oficial */}
        <EmbeddedCheckoutModal />

        {/* Barra Fixa Inferior de Compra */}
        <StickyBottomBar />
      </div>
    </CartProvider>
  );
}
