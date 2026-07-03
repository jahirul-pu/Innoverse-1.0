"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock: number;
  images: { url: string; alt?: string | null }[];
  brand?: { name: string };
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  toggleWishlist: (product: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistContextProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("innoverse-wishlist");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load wishlist items", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveItems = (newItems: WishlistItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("innoverse-wishlist", JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save wishlist items", e);
    }
  };

  const toggleWishlist = (product: WishlistItem) => {
    const exists = items.some((item) => item.id === product.id);
    let updatedItems: WishlistItem[] = [];

    if (exists) {
      updatedItems = items.filter((item) => item.id !== product.id);
      saveItems(updatedItems);
      toast.info(`Removed "${product.name}" from your favourites`);
    } else {
      updatedItems = [...items, product];
      saveItems(updatedItems);
      toast.success(`Added "${product.name}" to your favourites`);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    saveItems([]);
    toast.info("Cleared all favourites");
  };

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistContextProvider");
  }
  return context;
}
