/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductAccordion } from './components/ProductAccordion';
import { OfferSection } from './components/OfferSection';
import { BenefitsSection } from './components/BenefitsSection';
import { DemonstrationSection } from './components/DemonstrationSection';
import { HowToUseSection } from './components/HowToUseSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { StickyBottomBar } from './components/StickyBottomBar';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FAF6F7] text-stone-800 flex flex-col selection:bg-rose-200 selection:text-rose-900 pb-20 sm:pb-24">
        {/* Top Navigation */}
        <Header />

        <main className="flex-1">
          {/* Hero Section with Interactive 10-Image Gallery */}
          <Hero />

          {/* Expandable Product Specifications below gallery */}
          <section className="py-8 sm:py-10 bg-white/70 border-b border-rose-100/60">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <ProductAccordion />
            </div>
          </section>

          {/* Offer Section (3 selectable tiers in USD) */}
          <OfferSection />

          {/* Benefits Section */}
          <BenefitsSection />

          {/* Routine & Demonstration */}
          <DemonstrationSection />

          {/* How to use */}
          <HowToUseSection />

          {/* FAQ Section */}
          <FAQSection />

          {/* Final Call to Action */}
          <FinalCTA />
        </main>

        {/* Clean Simplified Footer with Catalog Reference Note */}
        <Footer />

        {/* Global Slide-Over Cart Drawer with 3-tier support */}
        <CartDrawer />

        {/* Disconnected Staging Checkout Modal */}
        <CheckoutModal />

        {/* Sticky Buy Bar for Mobile & Desktop */}
        <StickyBottomBar />
      </div>
    </CartProvider>
  );
}
