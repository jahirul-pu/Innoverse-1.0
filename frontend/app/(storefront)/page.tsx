"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./Home.module.css";

import { useCart } from "@/components/providers/CartContext";
import { productApi, categoryApi } from "@/lib/api";

export interface APIProduct {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock: number;
  brand: { name: string; slug: string };
  images: { url: string; alt?: string | null }[];
}

/* ── Mock Data ── */
const mockHeroSlides = [
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

const mockCategoryTiles = [
  { name: "Audio", icon: "🎧", href: "/category/audio", count: "42 products" },
  { name: "Smart Home", icon: "🏠", href: "/category/smart-home", count: "28 products" },
  { name: "Wearables", icon: "⌚", href: "/category/wearables", count: "19 products" },
  { name: "Accessories", icon: "🔌", href: "/category/accessories", count: "65 products" },
  { name: "Cameras", icon: "📷", href: "/category/cameras", count: "12 products" },
];

const mockNewArrivals = [
  { id: "1", name: "Wireless ANC Earbuds Pro", brand: { name: "SoundCore", slug: "soundcore" }, price: 2990, compareAtPrice: 3450, stock: 45, slug: "wireless-anc-earbuds-pro", images: [{ url: "" }] },
  { id: "2", name: "Magnetic USB-C Cable 2m", brand: { name: "Baseus", slug: "baseus" }, price: 490, stock: 200, slug: "magnetic-usb-c-cable", images: [{ url: "" }] },
  { id: "3", name: "Smart LED Strip 5M RGB", brand: { name: "Govee", slug: "govee" }, price: 1290, compareAtPrice: 1600, stock: 80, slug: "smart-led-strip", images: [{ url: "" }] },
  { id: "4", name: "Fitness Band 7 Pro", brand: { name: "Amazfit", slug: "amazfit" }, price: 3490, stock: 60, slug: "fitness-band-7-pro", images: [{ url: "" }] },
];

const mockDeals = [
  { id: "9", name: "Noise Cancelling Headphones", brand: { name: "Sony", slug: "sony" }, price: 8990, compareAtPrice: 12500, stock: 18, slug: "nc-headphones", images: [{ url: "" }] },
  { id: "10", name: "Smart Watch Ultra", brand: { name: "Amazfit", slug: "amazfit" }, price: 6490, compareAtPrice: 8900, stock: 25, slug: "smart-watch-ultra", images: [{ url: "" }] },
];

const mockTrending = [
  { id: "13", name: "TWS Gaming Earbuds", brand: { name: "Razer", slug: "razer" }, price: 4990, stock: 40, slug: "tws-gaming-earbuds", images: [{ url: "" }] },
  { id: "14", name: "Desk Lamp Smart LED", brand: { name: "Xiaomi", slug: "xiaomi" }, price: 2490, compareAtPrice: 2900, stock: 70, slug: "desk-lamp-smart", images: [{ url: "" }] },
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
function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;

  const primaryImage = product.images?.[0]?.url;

  return (
    <Link href={`/products/${product.slug}`} className={styles["product-card"]} id={`product-card-${product.id}`}>
      <div className={styles["product-card__image"]}>
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className={styles["product-card__img"]} />
        ) : (
          <div className={styles["product-card__image-placeholder"]}>📦</div>
        )}
        {discount && (
          <span className={styles["product-card__discount-badge"]}>{discount}</span>
        )}
        <button
          className={styles["product-card__quick-add"]}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              await addItem(product.id, 1, undefined, {
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                stock: product.stock,
                images: product.images,
                brand: product.brand,
              });
            } catch (err: any) {
              console.error(err);
            }
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <CartPlusIcon />
        </button>
      </div>
      <div className={styles["product-card__body"]}>
        <span
          className={`${styles["product-card__status"]} ${
            product.stock > 0
              ? styles["product-card__status--in-stock"]
              : styles["product-card__status--out-of-stock"]
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <span className={styles["product-card__brand"]}>{product.brand?.name}</span>
        <span className={styles["product-card__name"]}>{product.name}</span>
        <div className={styles["product-card__pricing"]}>
          <span className={styles["product-card__price"]}>৳{price.toLocaleString("en-BD")}</span>
          {comparePrice && (
            <span className={styles["product-card__price-original"]}>
              ৳{comparePrice.toLocaleString("en-BD")}
            </span>
          )}
          {discount && (
            <span className={styles["product-card__price-discount"]}>
              {discount}
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
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % mockHeroSlides.length);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Load backend API data
  useEffect(() => {
    async function loadApiData() {
      try {
        const [arrivalsRes, dealsRes, trendingRes, categoriesRes] = await Promise.all([
          productApi.list({ newArrival: true }),
          productApi.list({ featured: true }),
          productApi.list({ limit: 4 }),
          categoryApi.list(),
        ]);

        if (arrivalsRes && arrivalsRes.products) {
          setNewArrivals(arrivalsRes.products);
        } else {
          setNewArrivals(mockNewArrivals);
        }

        if (dealsRes && dealsRes.products) {
          setDeals(dealsRes.products);
        } else {
          setDeals(mockDeals);
        }

        if (trendingRes && trendingRes.products) {
          setTrending(trendingRes.products);
        } else {
          setTrending(mockTrending);
        }

        if (categoriesRes && categoriesRes.categories) {
          // Map backend categories format to icons
          const iconMap: Record<string, string> = {
            audio: "🎧",
            "smart-home": "🏠",
            wearables: "⌚",
            accessories: "🔌",
            cameras: "📷",
          };
          const mapped = categoriesRes.categories.map((cat: any) => ({
            name: cat.name,
            icon: iconMap[cat.slug] || "📦",
            href: `/products?category=${cat.slug}`,
            count: `${cat._count?.products || 0} products`,
          }));
          setCategories(mapped);
        } else {
          setCategories(mockCategoryTiles);
        }
      } catch (err) {
        console.error("Failed to load live data, using mock fallback", err);
        setNewArrivals(mockNewArrivals);
        setDeals(mockDeals);
        setTrending(mockTrending);
        setCategories(mockCategoryTiles);
      } finally {
        setLoading(false);
      }
    }

    loadApiData();
  }, []);

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section className={styles.hero} id="hero-carousel">
        <div className={styles.hero__carousel}>
          {mockHeroSlides.map((slide, index) => (
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
            {mockHeroSlides.map((_, index) => (
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
          {categories.map((cat) => (
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
