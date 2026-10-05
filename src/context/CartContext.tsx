/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { productConfig, ProductTier } from '../config/productConfig';

export interface CartItem {
  id: 'single' | 'kit_duo' | 'kit_quad';
  title: string;
  badge?: string;
  quantityUnits: number;
  unitWeight: string;
  unitPrice: number;
  quantity: number;
  shippingCost: number; // 0
  shippingText: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (tierId: 'single' | 'kit_duo' | 'kit_quad') => void;
  selectTier: (tierId: 'single' | 'kit_duo' | 'kit_quad') => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isCheckoutModalOpen: boolean;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  subtotal: number;
  shippingTotal: number;
  total: number;
  totalCount: number;
  totalSticksCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const getTierConfig = (tierId: 'single' | 'kit_duo' | 'kit_quad'): ProductTier => {
    if (tierId === 'single') return productConfig.tiers.single;
    if (tierId === 'kit_duo') return productConfig.tiers.kitDuo;
    return productConfig.tiers.kitQuad;
  };

  // Selects a tier from the offer cards, setting it cleanly in the cart
  const selectTier = (tierId: 'single' | 'kit_duo' | 'kit_quad') => {
    const tier = getTierConfig(tierId);
    const existing = items.find((item) => item.id === tierId);

    if (existing) {
      // If already present, ensure quantity is at least 1
      setIsDrawerOpen(true);
      return;
    }

    const newItem: CartItem = {
      id: tierId,
      title: tier.title,
      badge: tier.badge,
      quantityUnits: tier.quantity,
      unitWeight: tier.unitWeight,
      unitPrice: tier.price,
      quantity: 1,
      shippingCost: 0,
      shippingText: 'Free (EUA)',
    };

    // Replace previous selection with newly chosen tier so user isn't stuck with old tier
    setItems([newItem]);
    setIsDrawerOpen(true);
  };

  const addItem = (tierId: 'single' | 'kit_duo' | 'kit_quad') => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === tierId);
      if (existing) {
        return prev.map((item) =>
          item.id === tierId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      const tier = getTierConfig(tierId);
      const newItem: CartItem = {
        id: tierId,
        title: tier.title,
        badge: tier.badge,
        quantityUnits: tier.quantity,
        unitWeight: tier.unitWeight,
        unitPrice: tier.price,
        quantity: 1,
        shippingCost: 0,
        shippingText: 'Free (EUA)',
      };
      return [...prev, newItem];
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const openCheckoutModal = () => {
    setIsDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => setIsCheckoutModalOpen(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [items]);

  const shippingTotal = 0; // Always free shipping for all USA orders

  const total = useMemo(() => {
    return subtotal + shippingTotal;
  }, [subtotal, shippingTotal]);

  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const totalSticksCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.quantityUnits, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        selectTier,
        updateQuantity,
        removeItem,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isCheckoutModalOpen,
        openCheckoutModal,
        closeCheckoutModal,
        subtotal,
        shippingTotal,
        total,
        totalCount,
        totalSticksCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
