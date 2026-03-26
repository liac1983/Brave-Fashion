"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart/types";

type AddToCartInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "brave-fashion-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setItems(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(item: AddToCartInput) {
    const quantityToAdd = item.quantity ?? 1;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.variantId === item.variantId
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.variantId === item.variantId
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        );
      }

      return [...currentItems, { ...item, quantity: quantityToAdd }];
    });
  }

  function removeFromCart(variantId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.variantId !== variantId)
    );
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

