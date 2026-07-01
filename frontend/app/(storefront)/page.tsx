"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./Home.module.css";

/* ── Mock Data ── */
const heroSlides = [
  {
    id: 1,
    overline: "New Arrival",
    title: "Wireless ANC Earbuds Pro",
    description:
      "40dB active noise cancellation, 32-hour battery life, IPX5 water resistance. Your perfect everyday companion.",
    price: "৳2,990",
    originalPrice: "৳3,450",
    discount: "−13%",
    cta: "Shop Now",
    href: "/products/wireless-anc-earbuds-pro",
    gradient: "linear-gradient(135deg, #1a1c20 0%, #2a2d33 100%)",
  },
  {
    id: 2,
    overline: "Limited Deal",
    title: "Smart Home Starter Kit",
    description:
      "Everything you need to make your home smarter — hub, 3 smart plugs, and 2 LED bulbs included.",
    price: "৳5,490",
    originalPrice: "৳7,200",
    discount: "−24%",
    cta: "Grab the Deal",
    href: "/products/smart-home-starter-kit",
    gradient: "linear-gradient(135deg, #0f1923 0%, #1a2735 100%)",
  },
  {
    id: 3,
    overline: "Trending Now",
    title: "Ultra-Slim Power Bank 20000mAh",
    description:
      "Charge 3 devices simultaneously. USB-C PD 65W fast charging. Weighs just 340g.",
    price: "৳1,890",
    originalPrice: "৳2,200",
    discount: "−14%",
    cta: "Buy Now",
    href: "/products/ultra-slim-power-bank",
    gradient: "linear-gradient(135deg, #191b1f 0%, #252830 100%)",
  },
];

const categoryTiles = [
  { name: "Audio", icon: "🎧", href: "/category/audio", count: "42 products" },
  { name: "Smart Home", icon: "🏠", href: "/category/smart-home", count: "28 products" },
  { name: "Wearables", icon: "⌚", href: "/category/wearables", count: "19 products" },
  { name: "Accessories", icon: "🔌", href: "/category/accessories", count: "65 products" },
  { name: "Cameras", icon: "📷", href: "/category/cameras", count: "12 products" },
  { name: "Gaming", icon: "🎮", href: "/category/gaming", count: "31 products" },
];

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  inStock: boolean;
  href: string;
  image?: string;
}

const newArrivals: Product[] = [
  { id: 1, name: "Wireless ANC Earbuds Pro", brand: "SoundCore", price: "৳2,990", originalPrice: "৳3,450", discount: "−13%", inStock: true, href: "/products/wireless-anc-earbuds-pro" },
  { id: 2, name: "Magnetic USB-C Cable 2m", brand: "Baseus", price: "৳490", inStock: true, href: "/products/magnetic-usb-c-cable" },
  { id: 3, name: "Smart LED Strip 5M RGB", brand: "Govee", price: "৳1,290", originalPrice: "৳1,600", discount: "−19%", inStock: true, href: "/products/smart-led-strip" },
  { id: 4, name: "Fitness Band 7 Pro", brand: "Amazfit", price: "৳3,490", inStock: true, href: "/products/fitness-band-7-pro" },
  { id: 5, name: "Mini Bluetooth Speaker", brand: "JBL", price: "৳2,190", originalPrice: "৳2,500", discount: "−12%", inStock: false, href: "/products/mini-bluetooth-speaker" },
  { id: 6, name: "65W GaN Charger", brand: "Ugreen", price: "৳1,790", inStock: true, href: "/products/65w-gan-charger" },
  { id: 7, name: "Webcam 2K AutoFocus", brand: "Logitech", price: "৳4,990", originalPrice: "৳5,500", discount: "−9%", inStock: true, href: "/products/webcam-2k-autofocus" },
  { id: 8, name: "Smart Plug Wi-Fi 4 Pack", brand: "TP-Link", price: "৳2,290", inStock: true, href: "/products/smart-plug-wifi" },
];

const deals: Product[] = [
  { id: 9, name: "Noise Cancelling Headphones", brand: "Sony", price: "৳8,990", originalPrice: "৳12,500", discount: "−28%", inStock: true, href: "/products/nc-headphones" },
  { id: 10, name: "Smart Watch Ultra", brand: "Amazfit", price: "৳6,490", originalPrice: "৳8,900", discount: "−27%", inStock: true, href: "/products/smart-watch-ultra" },
  { id: 11, name: "Portable Projector Mini", brand: "XGIMI", price: "৳15,990", originalPrice: "৳19,900", discount: "−20%", inStock: true, href: "/products/portable-projector" },
  { id: 12, name: "Mechanical Keyboard RGB", brand: "Keychron", price: "৳5,490", originalPrice: "৳6,900", discount: "−20%", inStock: false, href: "/products/mechanical-keyboard" },
];

const trending: Product[] = [
  { id: 13, name: "TWS Gaming Earbuds", brand: "Razer", price: "৳4,990", inStock: true, href: "/products/tws-gaming-earbuds" },
  { id: 14, name: "Desk Lamp Smart LED", brand: "Xiaomi", price: "৳2,490", originalPrice: "৳2,900", discount: "−14%", inStock: true, href: "/products/desk-lamp-smart" },
  { id: 15, name: "Action Camera 4K", brand: "GoPro", price: "৳22,990", inStock: true, href: "/products/action-camera-4k" },
  { id: 16, name: "USB-C Hub 7-in-1", brand: "Anker", price: "৳3,290", originalPrice: "৳3,800", discount: "−13%", inStock: true, href: "/products/usb-c-hub-7in1" },
];

/* ── Icon Components ── */
const CartPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

/* ── Product Card Component ── */
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.href} className={styles["product-card"]} id={`product-card-${product.id}`}>
      <div className={styles["product-card__image"]}>
        <div className={styles["product-card__image-placeholder"]}>📦</div>
        {product.discount && (
          <span className={styles["product-card__discount-badge"]}>{product.discount}</span>
        )}
        <button
          className={styles["product-card__quick-add"]}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add to cart logic
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className={styles["product-card__body"]}>
        <span
          className={`${styles["product-card__status"]} ${
            product.inStock
              ? styles["product-card__status--in-stock"]
              : styles["product-card__status--out-of-stock"]
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
        <span className={styles["product-card__brand"]}>{product.brand}</span>
        <span className={styles["product-card__name"]}>{product.name}</span>
        <div className={styles["product-card__pricing"]}>
          <span className={styles["product-card__price"]}>{product.price}</span>
          {product.originalPrice && (
            <span className={styles["product-card__price-original"]}>
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className={styles["product-card__price-discount"]}>
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Homepage ── */
export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section className={styles.hero} id="hero-carousel">
        <div className={styles.hero__carousel}>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.hero__slide} ${
                index === activeSlide ? styles["hero__slide--active"] : ""
              }`}
              style={{ background: slide.gradient }}
            >
              <div className={styles["hero__slide-content"]}>
                <span className={styles["hero__slide-overline"]}>
                  {slide.overline}
                </span>
                <h1
                  className={styles["hero__slide-title"]}
                  style={{ color: "#EDEFF0" }}
                >
                  {slide.title}
                </h1>
                <p
                  className={styles["hero__slide-description"]}
                  style={{ color: "#A0A4AA" }}
                >
                  {slide.description}
                </p>
                <div className={styles["hero__slide-price"]}>
                  <span style={{ color: "#EDEFF0" }}>{slide.price}</span>
                  <span className={styles["hero__slide-price-original"]}>
                    {slide.originalPrice}
                  </span>
                  <span
                    style={{
                      color: "var(--color-signal-amber)",
                      fontSize: "var(--text-sm)",
                      marginLeft: "var(--space-2)",
                    }}
                  >
                    {slide.discount}
                  </span>
                </div>
                <div className={styles["hero__slide-actions"]}>
                  <Link href={slide.href} className="btn btn--primary btn--lg">
                    {slide.cta}
                  </Link>
                  <Link href="/deals" className="btn btn--secondary btn--lg" style={{ color: "#EDEFF0", borderColor: "#3a3d44" }}>
                    View All Deals
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Dots */}
          <div className={styles.hero__controls}>
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.hero__dot} ${
                  index === activeSlide ? styles["hero__dot--active"] : ""
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className={styles["trust-strip"]} id="trust-strip">
        <div className={`container ${styles["trust-strip__inner"]}`}>
          <div className={styles["trust-strip__item"]}>
            <span className={styles["trust-strip__icon"]}>✅</span>
            Authentic Products
          </div>
          <div className={styles["trust-strip__item"]}>
            <span className={styles["trust-strip__icon"]}>💰</span>
            Cash on Delivery
          </div>
          <div className={styles["trust-strip__item"]}>
            <span className={styles["trust-strip__icon"]}>📱</span>
            BanglaQR Payment
          </div>
          <div className={styles["trust-strip__item"]}>
            <span className={styles["trust-strip__icon"]}>🚚</span>
            Nationwide via Pathao
          </div>
          <div className={styles["trust-strip__item"]}>
            <span className={styles["trust-strip__icon"]}>↩️</span>
            Easy Returns
          </div>
        </div>
      </section>

      {/* ── Category Shortcuts ── */}
      <section className={`container ${styles.categories}`} id="category-shortcuts">
        <div className={styles.categories__grid}>
          {categoryTiles.map((cat) => (
            <Link key={cat.name} href={cat.href} className={styles["category-tile"]}>
              <span className={styles["category-tile__icon"]}>{cat.icon}</span>
              <span className={styles["category-tile__name"]}>{cat.name}</span>
              <span className={styles["category-tile__count"]}>{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className={`container ${styles["product-section"]}`} id="new-arrivals">
        <div className={styles["product-section__header"]}>
          <h2 className={styles["product-section__title"]}>Latest Products</h2>
          <Link href="/new-arrivals" className={styles["product-section__view-all"]}>
            View All <ArrowRightIcon />
          </Link>
        </div>
        <div className={styles["product-section__grid"]}>
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Deals ── */}
      <section className={`container ${styles["product-section"]}`} id="deals-section">
        <div className={styles["product-section__header"]}>
          <h2 className={styles["product-section__title"]}>🔥 Deals & Discounts</h2>
          <Link href="/deals" className={styles["product-section__view-all"]}>
            View All <ArrowRightIcon />
          </Link>
        </div>
        <div className={styles["product-section__grid"]}>
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section className={`container ${styles["product-section"]}`} id="trending-section">
        <div className={styles["product-section__header"]}>
          <h2 className={styles["product-section__title"]}>Trending Now</h2>
          <Link href="/trending" className={styles["product-section__view-all"]}>
            View All <ArrowRightIcon />
          </Link>
        </div>
        <div className={styles["product-section__grid"]}>
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
