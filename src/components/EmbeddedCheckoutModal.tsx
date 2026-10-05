/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { productConfig } from '../config/productConfig';
import { shopifyCheckout } from '../config/shopifyCheckout';
import fallbackProductImg from '../assets/images/rosa_balm_hero_1791199906964.jpg';

interface CheckoutConfig {
  publishableKey: string;
  isConfigured: boolean;
  isShopifyConfigured: boolean;
  shopifyDomain: string;
  shopifyFallbackEnabled: boolean;
  mode?: 'test' | 'live';
}

export const EmbeddedCheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, items, subtotal, total, totalSticksCount } =
    useCart();

  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null);
  const sessionRef = useRef<{ id: string; token: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!isCheckoutModalOpen) {
      sessionRef.current = null;
      setIsCompleted(false);
      setConfirming(false);
      setFetchError(null);
    }
  }, [isCheckoutModalOpen]);

  // Load public checkout configuration on mount
  useEffect(() => {
    fetch('/api/checkout/config')
      .then((res) => res.json())
      .then((data: CheckoutConfig) => {
        setConfig(data);
        if (data.publishableKey && data.isConfigured) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      })
      .catch((err) => {
        console.warn('Could not load checkout config from server:', err);
        setConfig({
          publishableKey: '',
          isConfigured: false,
          isShopifyConfigured: false,
          shopifyDomain: '6u0kc1-nm.myshopify.com',
          shopifyFallbackEnabled: false,
        });
      });
  }, []);

  // Fetch client secret for Stripe Embedded Checkout
  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.message || 'Failed to initialize Stripe checkout session.');
      }
      sessionRef.current = { id: data.sessionId, token: data.verificationToken };
      return data.clientSecret;
    } catch (err) {
      setFetchError((err as Error).message);
      throw err;
    }
  }, [items]);

  const handleComplete = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;
    setConfirming(true);
    try {
      const response = await fetch(`/api/checkout/session-status?session_id=${encodeURIComponent(session.id)}`, {
        headers: { 'X-Checkout-Token': session.token },
      });
      const result = await response.json();
      if (!response.ok || result.paymentStatus !== 'paid') throw new Error('Payment confirmation is pending. Please contact support before trying again.');
      setCompletedSessionId(session.id);
      setIsCompleted(true);
    } catch (error) { setFetchError((error as Error).message); }
    finally { setConfirming(false); }
  }, []);

  if (!isCheckoutModalOpen) return null;

  // Shopify permalink fallback (kept intact as an alternative if needed)
  const shopifyFallbackUrl = shopifyCheckout.buildCartPermalink(
    items.map((item) => ({ id: item.id, quantity: item.quantity }))
  );

  const getItemDetails = (item: {
    id: 'single' | 'kit_duo' | 'kit_quad';
    quantity: number;
    unitPrice: number;
  }) => {
    if (item.id === 'single') {
      const title = item.quantity === 1 ? '1 Stick (10g)' : `${item.quantity} Sticks (${item.quantity * 10}g)`;
      const image =
        item.quantity === 2
          ? productConfig.assets.productKit2
          : item.quantity >= 4
          ? productConfig.assets.productKit4
          : productConfig.assets.productIsolated;
      return {
        title,
        subtitle: 'Individual K-Beauty Multi Balm',
        weight: `${item.quantity * 10}g total`,
        image,
      };
    }

    if (item.id === 'kit_duo') {
      const title =
        item.quantity === 1
          ? '2 Sticks Duo Kit (20g)'
          : `${item.quantity}x Duo Kits (${item.quantity * 2} Sticks total)`;
      return {
        title,
        subtitle: 'Featured Duo Kit · 2 Units',
        weight: `${item.quantity * 20}g total`,
        image: productConfig.assets.productKit2,
      };
    }

    // kit_quad
    const title =
      item.quantity === 1
        ? '4 Sticks Value Kit (40g)'
        : `${item.quantity}x Value Kits (${item.quantity * 4} Sticks total)`;
    return {
      title,
      subtitle: 'Value Family Pack · 4 Units',
      weight: `${item.quantity * 40}g total`,
      image: productConfig.assets.productKit4,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeCheckoutModal}
        className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Spacious, Elegant Rosy Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-rose-200/90 z-10 animate-scale-in my-auto max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-[#FAF6F7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-2xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                Your Order
              </h3>
              <p className="text-[11px] text-stone-500">
                Free shipping to the United States
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCheckoutModal}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: 2-Column Responsive Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rose-100">
          {/* Left Column: Order Summary & Product Display (English) */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-[#FCF8F9] flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Your Order Summary</span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 mb-5">
                {items.map((item) => {
                  const details = getItemDetails(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-rose-100/90 shadow-2xs flex items-center gap-3.5"
                    >
                      {/* Real Product Artwork */}
                      <div className="w-18 h-20 sm:w-20 sm:h-22 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        <img
                          src={details.image}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== fallbackProductImg) {
                              target.src = fallbackProductImg;
                            }
                          }}
                          alt={details.title}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-rose-600 truncate">
                          {details.subtitle}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {details.title}
                        </h4>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Quantity: <span className="font-semibold text-stone-800">{item.quantity}</span> kit
                          {item.quantity > 1 ? 's' : ''}
                        </div>
                        <div className="text-sm font-extrabold text-stone-900 mt-1 tabular-nums">
                          ${(item.unitPrice * item.quantity).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-white border border-rose-100/80 text-xs space-y-2 mb-4 shadow-2xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ${subtotal.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    USA Standard Shipping
                  </span>
                  <span>Free ($0.00)</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900 text-sm">Total Due</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-stone-900 tabular-nums">
                      ${total.toFixed(2)} USD
                    </span>
                    <span className="block text-[10px] text-stone-500 font-normal">
                      Includes {totalSticksCount} {totalSticksCount === 1 ? 'stick' : 'sticks'} total
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Seals */}
            <div className="pt-3 border-t border-rose-100/60 text-[11px] text-stone-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your payment details are never collected in this summary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Orders processed with US delivery and tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Embedded Checkout Component OR Honest Readiness State */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center min-h-[420px]">
            {isCompleted ? (
              /* Success State */
              <div className="text-center py-8 px-4 max-w-md mx-auto animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h4 className="text-2xl font-extrabold text-stone-900 mb-2">
                  {config?.mode === 'test' ? 'Test payment completed' : 'Payment Completed!'}
                </h4>
                <p className="text-sm text-stone-600 mb-6">
                  {config?.mode === 'test' ? 'This was a test transaction. No real payment was collected and no product will be shipped.' : 'Your payment was verified. Thank you for your order.'}
                </p>
                <button
                  type="button"
                  onClick={closeCheckoutModal}
                  className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20"
                >
                  Return to Store
                </button>
              </div>
            ) : config?.isConfigured && stripePromise && !fetchError ? (
              /* Official Stripe Embedded Checkout */
              <div className="w-full">
                {config.mode === 'test' && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Test checkout — no real charges or shipments.</p>}
                {confirming && <p role="status" className="mb-3 text-sm">Confirming your payment…</p>}
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret,
                    onComplete: handleComplete,
                  }}
                >
                  <EmbeddedCheckout className="w-full min-h-[400px]" />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <div className="text-left space-y-4">
                <h4 className="text-xl font-bold text-stone-900">Online checkout is temporarily unavailable</h4>
                <p className="text-sm text-stone-600">{fetchError || 'Please contact us for assistance. No payment has been collected.'}</p>
                <a href="mailto:contato@balmmultiusopinkcollagen.shop" className="text-rose-700 underline break-all">contato@balmmultiusopinkcollagen.shop</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

