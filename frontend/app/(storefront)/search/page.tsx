"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./Search.module.css";
import homeStyles from "../Home.module.css";

const CartPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  inStock: boolean;
  href: string;
}

const allProducts: Product[] = [
  { id: 1, name: "Wireless ANC Earbuds Pro", brand: "SoundCore", price: "৳2,990", originalPrice: "৳3,450", discount: "−13%", inStock: true, href: "/products/wireless-anc-earbuds-pro" },
  { id: 2, name: "Magnetic USB-C Cable 2m", brand: "Baseus", price: "৳490", inStock: true, href: "/products/magnetic-usb-c-cable" },
  { id: 3, name: "Smart LED Strip 5M RGB", brand: "Govee", price: "৳1,290", originalPrice: "৳1,600", discount: "−19%", inStock: true, href: "/products/smart-led-strip" },
  { id: 4, name: "Fitness Band 7 Pro", brand: "Amazfit", price: "৳3,490", inStock: true, href: "/products/fitness-band-7-pro" },
  { id: 5, name: "Mini Bluetooth Speaker", brand: "JBL", price: "৳2,190", originalPrice: "৳2,500", discount: "−12%", inStock: false, href: "/products/mini-bluetooth-speaker" },
  { id: 6, name: "65W GaN Charger", brand: "Ugreen", price: "৳1,790", inStock: true, href: "/products/65w-gan-charger" },
  { id: 7, name: "Webcam 2K AutoFocus", brand: "Logitech", price: "৳4,990", originalPrice: "৳5,500", discount: "−9%", inStock: true, href: "/products/webcam-2k-autofocus" },
  { id: 8, name: "Smart Plug Wi-Fi 4 Pack", brand: "TP-Link", price: "৳2,290", inStock: true, href: "/products/smart-plug-wifi" },
  { id: 9, name: "Noise Cancelling Headphones", brand: "Sony", price: "৳8,990", originalPrice: "৳12,500", discount: "−28%", inStock: true, href: "/products/nc-headphones" },
  { id: 10, name: "Smart Watch Ultra", brand: "Amazfit", price: "৳6,490", originalPrice: "৳8,900", discount: "−27%", inStock: true, href: "/products/smart-watch-ultra" },
  { id: 11, name: "Portable Projector Mini", brand: "XGIMI", price: "৳15,990", originalPrice: "৳19,900", discount: "−20%", inStock: true, href: "/products/portable-projector" },
  { id: 12, name: "Mechanical Keyboard RGB", brand: "Keychron", price: "৳5,490", originalPrice: "৳6,900", discount: "−20%", inStock: false, href: "/products/mechanical-keyboard" },
  { id: 13, name: "TWS Gaming Earbuds", brand: "Razer", price: "৳4,990", inStock: true, href: "/products/tws-gaming-earbuds" },
  { id: 14, name: "Desk Lamp Smart LED", brand: "Xiaomi", price: "৳2,490", originalPrice: "৳2,900", discount: "−14%", inStock: true, href: "/products/desk-lamp-smart" },
  { id: 15, name: "Action Camera 4K", brand: "GoPro", price: "৳22,990", inStock: true, href: "/products/action-camera-4k" },
  { id: 16, name: "USB-C Hub 7-in-1", brand: "Anker", price: "৳3,290", originalPrice: "৳3,800", discount: "−13%", inStock: true, href: "/products/usb-c-hub-7in1" },
];

const popularSearches = ["earbuds", "charger", "smart watch", "LED strip", "keyboard", "speaker"];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.href} className={homeStyles["product-card"]}>
      <div className={homeStyles["product-card__image"]}>
        <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
        {product.discount && <span className={homeStyles["product-card__discount-badge"]}>{product.discount}</span>}
        <button
          className={homeStyles["product-card__quick-add"]}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label={`Add ${product.name} to cart`}
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className={homeStyles["product-card__body"]}>
        <span className={`${homeStyles["product-card__status"]} ${product.inStock ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className={homeStyles["product-card__brand"]}>{product.brand}</span>
        <span className={homeStyles["product-card__name"]}>{product.name}</span>
        <div className={homeStyles["product-card__pricing"]}>
          <span className={homeStyles["product-card__price"]}>{product.price}</span>
          {product.originalPrice && <span className={homeStyles["product-card__price-original"]}>{product.originalPrice}</span>}
          {product.discount && <span className={homeStyles["product-card__price-discount"]}>{product.discount}</span>}
        </div>
      </div>
    </Link>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchInput(term);
    setQuery(term);
  };

  return (
    <div className={`container ${styles["search-page"]}`}>
      {/* Search Bar */}
      <form className={styles["search-bar"]} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles["search-bar__input"]}
          placeholder="Search gadgets, brands, categories..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoFocus
          id="search-input"
        />
        <button type="submit" className={styles["search-bar__btn"]} id="search-btn">
          <SearchIcon />
        </button>
      </form>

      {/* Suggestions */}
      <div className={styles["search-suggestions"]}>
        <span className={styles["search-suggestions__label"]}>Popular:</span>
        {popularSearches.map((term) => (
          <button
            key={term}
            className={styles["search-suggestion"]}
            onClick={() => handleSuggestionClick(term)}
          >
            {term}
          </button>
        ))}
      </div>

      {/* Results Header */}
      {query && (
        <div className={styles["search-page__header"]}>
          <h1 className={styles["search-page__title"]}>
            Results for &ldquo;<span>{query}</span>&rdquo;
          </h1>
          <span className={styles["search-page__count"]}>
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <div className={styles["search-results"]}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && (
        <div className={styles["search-empty"]}>
          <div className={styles["search-empty__icon"]}>🔍</div>
          <h2 className={styles["search-empty__title"]}>No results found</h2>
          <p className={styles["search-empty__text"]}>
            We couldn&apos;t find any products matching &ldquo;{query}&rdquo;. Try a different search term or browse our categories.
          </p>
          <ul className={styles["search-empty__tips"]}>
            <li>Check for typos or spelling errors</li>
            <li>Try broader search terms</li>
            <li>Search by brand name</li>
          </ul>
          <Link href="/products" className="btn btn--primary" style={{ marginTop: "var(--space-4)" }}>
            Browse All Products
          </Link>
        </div>
      )}

      {/* No query state */}
      {!query && (
        <div className={styles["search-empty"]}>
          <div className={styles["search-empty__icon"]}>🔎</div>
          <h2 className={styles["search-empty__title"]}>What are you looking for?</h2>
          <p className={styles["search-empty__text"]}>
            Search by product name, brand, or category. Try the popular searches above to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className={`container ${styles["search-page"]}`} style={{ textAlign: "center", padding: "var(--space-16)" }}>
        Loading...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
