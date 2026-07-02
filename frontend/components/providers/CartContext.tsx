"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string; // cart item id
  productId: string;
  quantity: number;
  variantId?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    compareAtPrice?: number | string | null;
    stock: number;
    images: { url: string; alt?: string | null }[];
    brand?: { name: string };
  };
}

export interface ProductDetails {
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock: number;
  images: { url: string; alt?: string | null }[];
  brand?: { name: string };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  subtotal: number;
  total: number;
  addItem: (productId: string, quantity?: number, variantId?: string, productDetails?: ProductDetails) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate totals
  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.product.price) || 0;
    return acc + price * item.quantity;
  }, 0);

  const total = subtotal; // Can add discount / shipping logic if needed, but subtotal is clean core

  const refreshCart = async () => {
    if (!user) {
      // Guest local cart
      try {
        const local = localStorage.getItem("innoverse-cart");
        if (local) {
          setItems(JSON.parse(local));
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
      setLoading(false);
      return;
    }

    // Authenticated cart
    try {
      setLoading(true);
      const res = await cartApi.get();
      if (res && res.cart && res.cart.items) {
        setItems(res.cart.items);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Run on user state changes
  useEffect(() => {
    const syncAndRefresh = async () => {
      if (user) {
        // Sync local storage guest cart items to database upon login
        try {
          const local = localStorage.getItem("innoverse-cart");
          if (local) {
            const guestItems = JSON.parse(local) as CartItem[];
            if (guestItems.length > 0) {
              for (const item of guestItems) {
                await cartApi.addItem(item.productId, item.quantity, item.variantId || undefined);
              }
              localStorage.removeItem("innoverse-cart");
            }
          }
        } catch (e) {
          console.error("Failed to sync guest cart", e);
        }
      }
      refreshCart();
    };

    syncAndRefresh();
  }, [user]);

  const addItem = async (productId: string, quantity = 1, variantId?: string, productDetails?: ProductDetails) => {
    if (!user) {
      const local = localStorage.getItem("innoverse-cart");
      let currentItems: CartItem[] = [];
      try {
        if (local) currentItems = JSON.parse(local);
      } catch {
        currentItems = [];
      }

      const existingIndex = currentItems.findIndex(
        (i) => i.productId === productId && i.variantId === (variantId || null)
      );

      if (existingIndex > -1) {
        currentItems[existingIndex].quantity += quantity;
        // Update product details if provided (in case they were missing before)
        if (productDetails) {
          currentItems[existingIndex].product = {
            id: productId,
            name: productDetails.name,
            slug: productDetails.slug,
            price: productDetails.price,
            compareAtPrice: productDetails.compareAtPrice,
            stock: productDetails.stock,
            images: productDetails.images,
            brand: productDetails.brand,
          };
        }
      } else {
        const id = Math.random().toString(36).substring(7);
        currentItems.push({
          id,
          productId,
          quantity,
          variantId: variantId || null,
          product: {
            id: productId,
            name: productDetails?.name || "Product",
            slug: productDetails?.slug || "",
            price: productDetails?.price || 0,
            compareAtPrice: productDetails?.compareAtPrice,
            stock: productDetails?.stock ?? 99,
            images: productDetails?.images || [],
            brand: productDetails?.brand,
          },
        });
      }
      localStorage.setItem("innoverse-cart", JSON.stringify(currentItems));
      setItems(currentItems);
      return;
    }

    // Server-side cart
    await cartApi.addItem(productId, quantity, variantId);
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) {
      const local = localStorage.getItem("innoverse-cart");
      if (local) {
        let currentItems = JSON.parse(local) as CartItem[];
        const idx = currentItems.findIndex((i) => i.id === itemId);
        if (idx > -1) {
          currentItems[idx].quantity = quantity;
          localStorage.setItem("innoverse-cart", JSON.stringify(currentItems));
          setItems(currentItems);
        }
      }
      return;
    }

    await cartApi.updateQuantity(itemId, quantity);
    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    if (!user) {
      const local = localStorage.getItem("innoverse-cart");
      if (local) {
        let currentItems = JSON.parse(local) as CartItem[];
        currentItems = currentItems.filter((i) => i.id !== itemId);
        localStorage.setItem("innoverse-cart", JSON.stringify(currentItems));
        setItems(currentItems);
      }
      return;
    }

    await cartApi.removeItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("innoverse-cart");
      setItems([]);
      return;
    }

    await cartApi.clear();
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        subtotal,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
}
