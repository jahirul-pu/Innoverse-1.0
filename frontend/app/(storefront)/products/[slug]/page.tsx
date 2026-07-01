"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ProductDetail.module.css";
import homeStyles from "../../Home.module.css";

/* ── Icons ── */
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
  </svg>
);

const CartPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

/* ── Mock Product Data ── */
const product = {
  name: "Wireless ANC Earbuds Pro",
  brand: "SoundCore",
  brandHref: "/brands/soundcore",
  shortDescription: "Premium active noise cancelling earbuds with 40dB ANC depth, Hi-Res audio certification, and 32-hour total battery life. IPX5 water resistant.",
  price: "৳2,990",
  originalPrice: "৳3,450",
  discount: "−13%",
  savings: "You save ৳460",
  inStock: true,
  sku: "SC-ANC-PRO-BK",
  colors: [
    { name: "Midnight Black", hex: "#1C1E20" },
    { name: "Arctic White", hex: "#F3F4F1" },
    { name: "Navy Blue", hex: "#2F3E63" },
  ],
  thumbnails: [1, 2, 3, 4, 5],
  specs: [
    ["Driver Size", "10mm dynamic"],
    ["ANC Depth", "40dB"],
    ["Bluetooth", "5.3"],
    ["Codec", "LDAC, AAC, SBC"],
    ["Battery (Buds)", "8 hours (ANC on)"],
    ["Battery (Case)", "32 hours total"],
    ["Water Resistance", "IPX5"],
    ["Weight (Per Bud)", "5.2g"],
    ["Charging", "USB-C, Wireless Qi"],
    ["Warranty", "1 Year Official"],
    ["Box Contents", "Earbuds, Case, USB-C cable, 3× ear tips, Quick start guide"],
  ],
  description: `
    <p>Experience audio excellence with the SoundCore Wireless ANC Earbuds Pro. Featuring industry-leading 40dB active noise cancellation, these earbuds create a personal sound sanctuary wherever you are.</p>
    <p>Hi-Res Audio certified with LDAC codec support, delivering studio-quality wireless audio at up to 990kbps. The custom 10mm dynamic drivers produce rich, detailed sound across the entire frequency range.</p>
    <p>With 8 hours of playback on a single charge (ANC on) and 32 hours total with the charging case, you'll have enough power for even the longest days. IPX5 water resistance means they're built for workouts and rainy commutes alike.</p>
    <p>The ergonomic design and three sizes of silicone ear tips ensure a secure, comfortable fit. Touch controls on each earbud give you effortless control over music, calls, and noise cancellation modes.</p>
  `,
  reviews: [
    { id: 1, author: "Rahim A.", date: "Jun 2026", rating: 5, text: "Incredible ANC for the price. Bass is punchy, mids are clear. Battery lasts me 2 full days. Best purchase I've made this year.", verified: true },
    { id: 2, author: "Nusrat K.", date: "Jun 2026", rating: 4, text: "Sound quality is fantastic. ANC works well in the bus. Only wish the case was a bit smaller. Still, great value.", verified: true },
    { id: 3, author: "Tanvir H.", date: "May 2026", rating: 5, text: "Comparing to my old ৳8,000 earbuds, these are 90% there for a third of the price. LDAC support is the real deal.", verified: true },
  ],
  ratingAvg: 4.7,
  ratingCount: 48,
  ratingDistribution: [38, 7, 2, 1, 0],
};

const relatedProducts = [
  { id: 5, name: "Mini Bluetooth Speaker", brand: "JBL", price: "৳2,190", originalPrice: "৳2,500", discount: "−12%", inStock: false, href: "/products/mini-bluetooth-speaker" },
  { id: 9, name: "Noise Cancelling Headphones", brand: "Sony", price: "৳8,990", originalPrice: "৳12,500", discount: "−28%", inStock: true, href: "/products/nc-headphones" },
  { id: 13, name: "TWS Gaming Earbuds", brand: "Razer", price: "৳4,990", inStock: true, href: "/products/tws-gaming-earbuds" },
  { id: 2, name: "Magnetic USB-C Cable 2m", brand: "Baseus", price: "৳490", inStock: true, href: "/products/magnetic-usb-c-cable" },
];

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className={`container ${styles.pdp}`}>
      {/* Breadcrumb */}
      <ul className={styles.pdp__breadcrumb}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/category/audio">Audio</Link></li>
        <li><span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{product.name}</span></li>
      </ul>

      {/* Main Layout: Gallery + Info */}
      <div className={styles.pdp__layout}>
        {/* Gallery */}
        <div className={styles.pdp__gallery}>
          <div className={styles["pdp__main-image"]} id="pdp-main-image">
            <div className={styles["pdp__main-image-placeholder"]}>🎧</div>
          </div>
          <div className={styles.pdp__thumbnails}>
            {product.thumbnails.map((_, i) => (
              <button
                key={i}
                className={`${styles.pdp__thumbnail} ${i === selectedThumbnail ? styles["pdp__thumbnail--active"] : ""}`}
                onClick={() => setSelectedThumbnail(i)}
                aria-label={`View image ${i + 1}`}
              >
                <div className={styles["pdp__thumbnail-placeholder"]}>🎧</div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.pdp__info}>
          {/* Status */}
          <span className={`${styles.pdp__status} ${product.inStock ? styles["pdp__status--in-stock"] : styles["pdp__status--out-of-stock"]}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>

          {/* Brand */}
          <Link href={product.brandHref} className={styles.pdp__brand}>{product.brand}</Link>

          {/* Name */}
          <h1 className={styles.pdp__name}>{product.name}</h1>

          {/* Short Description */}
          <p className={styles["pdp__short-desc"]}>{product.shortDescription}</p>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ color: "var(--color-signal-amber)", fontSize: "var(--text-sm)" }}>{stars(Math.round(product.ratingAvg))}</span>
            <span className="data-text" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {product.ratingAvg}
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
              ({product.ratingCount} reviews)
            </span>
          </div>

          {/* SKU */}
          <span className="data-text" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            SKU: {product.sku}
          </span>

          {/* Pricing */}
          <div className={styles.pdp__pricing}>
            <span className={styles.pdp__price}>{product.price}</span>
            <span className={styles["pdp__price-original"]}>{product.originalPrice}</span>
            <span className={styles["pdp__price-discount"]}>{product.discount}</span>
            <span className={styles["pdp__price-savings"]}>{product.savings}</span>
          </div>

          {/* Color Variants */}
          <div className={styles.pdp__variants}>
            <div className={styles["pdp__variant-group"]}>
              <span className={styles["pdp__variant-label"]}>
                Color: <span>{product.colors[selectedColor].name}</span>
              </span>
              <div className={styles["pdp__variant-options"]}>
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    className={`${styles["pdp__color-btn"]} ${i === selectedColor ? styles["pdp__color-btn--active"] : ""}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(i)}
                    aria-label={color.name}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className={styles.pdp__quantity}>
            <span className={styles["pdp__quantity-label"]}>Quantity:</span>
            <div className={styles["pdp__quantity-controls"]}>
              <button
                className={styles["pdp__quantity-btn"]}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className={styles["pdp__quantity-value"]}>{quantity}</span>
              <button
                className={styles["pdp__quantity-btn"]}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.pdp__actions}>
            <button className={`btn btn--primary btn--lg ${styles["pdp__add-to-cart"]}`} id="add-to-cart-btn">
              <CartPlusIcon /> Add to Cart
            </button>
            <button className={`btn btn--lg ${styles["pdp__buy-now"]}`} id="buy-now-btn">
              Buy Now
            </button>
            <button className={styles["pdp__wishlist-btn"]} aria-label="Add to wishlist" id="wishlist-btn">
              <HeartIcon />
            </button>
            <button className={styles["pdp__share-btn"]} aria-label="Share product" id="share-btn">
              <ShareIcon />
            </button>
          </div>

          {/* Delivery Estimate */}
          <div className={styles.pdp__delivery}>
            <div className={styles["pdp__delivery-title"]}>
              <TruckIcon /> Delivery Estimate
            </div>
            <div className={styles["pdp__delivery-option"]}>
              <span className={styles["pdp__delivery-zone"]}>Inside Dhaka</span>
              <span className={styles["pdp__delivery-time"]}>1–2 days</span>
              <span className={styles["pdp__delivery-cost"]}>৳60</span>
            </div>
            <div className={styles["pdp__delivery-option"]}>
              <span className={styles["pdp__delivery-zone"]}>Outside Dhaka</span>
              <span className={styles["pdp__delivery-time"]}>3–5 days</span>
              <span className={styles["pdp__delivery-cost"]}>৳120</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className={styles.pdp__tabs}>
        <ul className={styles["pdp__tab-list"]} role="tablist">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.pdp__tab} ${activeTab === tab ? styles["pdp__tab--active"] : ""}`}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${product.ratingCount})`}
            </button>
          ))}
        </ul>

        <div className={styles["pdp__tab-content"]}>
          {activeTab === "description" && (
            <div dangerouslySetInnerHTML={{ __html: product.description }} style={{ lineHeight: "var(--leading-relaxed)", color: "var(--color-text-secondary)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }} />
          )}

          {activeTab === "specs" && (
            <table className={styles["specs-table"]}>
              <tbody>
                {product.specs.map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Rating Summary */}
              <div className={styles.reviews__summary}>
                <div className={styles.reviews__average}>
                  <div className={styles["reviews__average-score"]}>{product.ratingAvg}</div>
                  <div className={styles["reviews__average-stars"]}>{stars(Math.round(product.ratingAvg))}</div>
                  <div className={styles["reviews__average-count"]}>{product.ratingCount} reviews</div>
                </div>
                <div className={styles.reviews__bars}>
                  {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} className={styles["reviews__bar-row"]}>
                      <span className={styles["reviews__bar-label"]}>{star}</span>
                      <div className={styles.reviews__bar}>
                        <div
                          className={styles["reviews__bar-fill"]}
                          style={{ width: `${(product.ratingDistribution[i] / product.ratingCount) * 100}%` }}
                        />
                      </div>
                      <span className={styles["reviews__bar-count"]}>{product.ratingDistribution[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              {product.reviews.map((review) => (
                <div key={review.id} className={styles["review-card"]}>
                  <div className={styles["review-card__header"]}>
                    <span className={styles["review-card__author"]}>{review.author}</span>
                    <span className={styles["review-card__date"]}>{review.date}</span>
                  </div>
                  <div className={styles["review-card__stars"]}>{stars(review.rating)}</div>
                  {review.verified && (
                    <div className={styles["review-card__verified"]}>✓ Verified Purchase</div>
                  )}
                  <p className={styles["review-card__text"]}>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className={styles.pdp__related}>
        <h2 className={styles["pdp__related-title"]}>You May Also Like</h2>
        <div className={styles["pdp__related-grid"]}>
          {relatedProducts.map((p) => (
            <Link key={p.id} href={p.href} className={homeStyles["product-card"]}>
              <div className={homeStyles["product-card__image"]}>
                <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
                {p.discount && <span className={homeStyles["product-card__discount-badge"]}>{p.discount}</span>}
              </div>
              <div className={homeStyles["product-card__body"]}>
                <span className={`${homeStyles["product-card__status"]} ${p.inStock ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
                  {p.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <span className={homeStyles["product-card__brand"]}>{p.brand}</span>
                <span className={homeStyles["product-card__name"]}>{p.name}</span>
                <div className={homeStyles["product-card__pricing"]}>
                  <span className={homeStyles["product-card__price"]}>{p.price}</span>
                  {p.originalPrice && <span className={homeStyles["product-card__price-original"]}>{p.originalPrice}</span>}
                  {p.discount && <span className={homeStyles["product-card__price-discount"]}>{p.discount}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
