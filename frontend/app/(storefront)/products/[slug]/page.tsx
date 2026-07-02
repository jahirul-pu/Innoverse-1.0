"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { productApi } from "@/lib/api";
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

/* ── Mock Product Data Fallback ── */
const mockFallbackProduct = {
  id: "mock-id-1",
  name: "Wireless ANC Earbuds Pro",
  brand: { name: "SoundCore", slug: "soundcore" },
  shortDescription: "Premium active noise cancelling earbuds with 40dB ANC depth, Hi-Res audio certification, and 32-hour total battery life. IPX5 water resistant.",
  price: 2990,
  compareAtPrice: 3450,
  stock: 45,
  sku: "SC-ANC-PRO-BK",
  colors: [
    { name: "Midnight Black", hex: "#1C1E20" },
    { name: "Arctic White", hex: "#F3F4F1" },
    { name: "Navy Blue", hex: "#2F3E63" },
  ],
  images: [{ url: "" }, { url: "" }, { url: "" }],
  specs: [
    { name: "Driver Size", value: "10mm dynamic" },
    { name: "ANC Depth", value: "40dB" },
    { name: "Bluetooth", value: "5.3" },
    { name: "Codec", value: "LDAC, AAC, SBC" },
  ],
  description: `
    <p>Experience audio excellence with the SoundCore Wireless ANC Earbuds Pro. Featuring industry-leading 40dB active noise cancellation, these earbuds create a personal sound sanctuary wherever you are.</p>
  `,
  reviews: [
    { id: "rev-1", rating: 5, comment: "Incredible ANC for the price. Bass is punchy, mids are clear.", user: { name: "Rahim A." }, createdAt: "2026-06-25T12:00:00Z" },
  ],
  ratingAvg: 4.7,
  ratingCount: 48,
  ratingDistribution: [38, 7, 2, 1, 0],
};

const mockRelatedProducts = [
  { id: "5", name: "Mini Bluetooth Speaker", brand: { name: "JBL" }, price: 2190, compareAtPrice: 2500, stock: 0, slug: "mini-bluetooth-speaker", images: [{ url: "" }] },
  { id: "9", name: "Noise Cancelling Headphones", brand: { name: "Sony" }, price: 8990, compareAtPrice: 12500, stock: 18, slug: "nc-headphones", images: [{ url: "" }] },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  // Load product details from API
  useEffect(() => {
    async function loadProductData() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await productApi.getBySlug(slug);
        if (res && res.product) {
          setProduct(res.product);
          if (res.relatedProducts) {
            setRelatedProducts(res.relatedProducts);
          } else {
            setRelatedProducts(mockRelatedProducts);
          }
        } else {
          setProduct(mockFallbackProduct);
          setRelatedProducts(mockRelatedProducts);
        }
      } catch (err) {
        console.error("Failed to load product details from API, using fallback", err);
        setProduct(mockFallbackProduct);
        setRelatedProducts(mockRelatedProducts);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  const stars = (rating: number) => "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "var(--space-20)", fontFamily: "var(--font-data)", color: "var(--color-text-tertiary)" }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "var(--space-20)" }}>
        <h2>Product not found</h2>
        <Link href="/products" className="btn btn--primary" style={{ marginTop: "var(--space-4)" }}>Browse All Products</Link>
      </div>
    );
  }

  // Get color options from API variants or fallback colors field
  const colorVariants = product.variants
    ? product.variants.filter((v: any) => v.type === "color").map((v: any) => ({
        id: v.id,
        name: v.name,
        hex: v.value,
        priceAdj: Number(v.priceAdj) || 0,
        stock: v.stock
      }))
    : (product.colors || []);

  const selectedVariant = colorVariants[selectedColor];
  const price = (Number(product.price) || 0) + (selectedVariant?.priceAdj || 0);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;
  const savings = comparePrice && comparePrice > price ? `You save ৳${(comparePrice - price).toLocaleString("en-BD")}` : null;

  const currentImage = product.images?.[selectedThumbnail]?.url || "";

  return (
    <div className={`container ${styles.pdp}`}>
      {/* Breadcrumb */}
      <ul className={styles.pdp__breadcrumb}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        {product.category && (
          <li><Link href={`/products?category=${product.category.slug}`}>{product.category.name}</Link></li>
        )}
        <li><span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{product.name}</span></li>
      </ul>

      {/* Main Layout: Gallery + Info */}
      <div className={styles.pdp__layout}>
        {/* Gallery */}
        <div className={styles.pdp__gallery}>
          <div className={styles["pdp__main-image"]} id="pdp-main-image">
            {currentImage ? (
              <img src={currentImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <div className={styles["pdp__main-image-placeholder"]}>📦</div>
            )}
          </div>
          <div className={styles.pdp__thumbnails}>
            {product.images?.map((img: any, i: number) => (
              <button
                key={i}
                className={`${styles.pdp__thumbnail} ${i === selectedThumbnail ? styles["pdp__thumbnail--active"] : ""}`}
                onClick={() => setSelectedThumbnail(i)}
                aria-label={`View image ${i + 1}`}
              >
                {img.url ? (
                  <img src={img.url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div className={styles["pdp__thumbnail-placeholder"]}>📦</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.pdp__info}>
          {/* Status */}
          <span className={`${styles.pdp__status} ${currentStock > 0 ? styles["pdp__status--in-stock"] : styles["pdp__status--out-of-stock"]}`}>
            {currentStock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          {/* Brand */}
          {product.brand && (
            <Link href={`/products?brand=${product.brand.slug}`} className={styles.pdp__brand}>{product.brand.name}</Link>
          )}

          {/* Name */}
          <h1 className={styles.pdp__name}>{product.name}</h1>

          {/* Short Description */}
          <p className={styles["pdp__short-desc"]}>{product.shortDescription}</p>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ color: "var(--color-signal-amber)", fontSize: "var(--text-sm)" }}>{stars(product.ratingAvg || 5)}</span>
            <span className="data-text" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {product.ratingAvg || "5.0"}
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
              ({product.ratingCount || 0} reviews)
            </span>
          </div>

          {/* SKU */}
          <span className="data-text" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            SKU: {product.sku}
          </span>

          {/* Pricing */}
          <div className={styles.pdp__pricing}>
            <span className={styles.pdp__price}>৳{price.toLocaleString("en-BD")}</span>
            {comparePrice && <span className={styles["pdp__price-original"]}>৳{comparePrice.toLocaleString("en-BD")}</span>}
            {discount && <span className={styles["pdp__price-discount"]}>{discount}</span>}
            {savings && <span className={styles["pdp__price-savings"]}>{savings}</span>}
          </div>

          {/* Color Variants (if any) */}
          {colorVariants.length > 0 && (
            <div className={styles.pdp__variants}>
              <div className={styles["pdp__variant-group"]}>
                <span className={styles["pdp__variant-label"]}>
                  Color: <span>{colorVariants[selectedColor]?.name}</span>
                </span>
                <div className={styles["pdp__variant-options"]}>
                  {colorVariants.map((color: any, i: number) => (
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
          )}

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
            <button
              className={`btn btn--primary ${styles["pdp__add-to-cart"]}`}
              id="add-to-cart-btn"
              onClick={async () => {
                try {
                  await addItem(product.id, quantity, selectedVariant?.id, {
                    name: product.name,
                    slug: product.slug || slug,
                    price: price,
                    compareAtPrice: product.compareAtPrice,
                    stock: currentStock,
                    images: product.images,
                    brand: product.brand,
                  });
                  alert("Added to cart!");
                } catch (err) {
                  console.error(err);
                }
              }}
              disabled={currentStock <= 0}
            >
              <CartPlusIcon /> Add to Cart
            </button>
            <button
              className={`btn ${styles["pdp__buy-now"]}`}
              id="buy-now-btn"
              onClick={async () => {
                try {
                  await addItem(product.id, quantity, selectedVariant?.id, {
                    name: product.name,
                    slug: product.slug || slug,
                    price: price,
                    compareAtPrice: product.compareAtPrice,
                    stock: currentStock,
                    images: product.images,
                    brand: product.brand,
                  });
                  window.location.href = "/checkout";
                } catch (err) {
                  console.error(err);
                }
              }}
              disabled={currentStock <= 0}
            >
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
              {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${product.ratingCount || 0})`}
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
                {product.specs?.map((spec: any) => (
                  <tr key={spec.name}>
                    <td>{spec.name}</td>
                    <td>{spec.value}</td>
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
                  <div className={styles["reviews__average-score"]}>{product.ratingAvg || "5.0"}</div>
                  <div className={styles["reviews__average-stars"]}>{stars(product.ratingAvg || 5)}</div>
                  <div className={styles["reviews__average-count"]}>{product.ratingCount || 0} reviews</div>
                </div>
                <div className={styles.reviews__bars}>
                  {[5, 4, 3, 2, 1].map((star, i) => (
                    <div key={star} className={styles["reviews__bar-row"]}>
                      <span className={styles["reviews__bar-label"]}>{star}</span>
                      <div className={styles.reviews__bar}>
                        <div
                          className={styles["reviews__bar-fill"]}
                          style={{ width: `${product.ratingCount ? ((product.ratingDistribution?.[i] || 0) / product.ratingCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className={styles["reviews__bar-count"]}>{product.ratingDistribution?.[i] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div key={review.id} className={styles["review-card"]}>
                    <div className={styles["review-card__header"]}>
                      <span className={styles["review-card__author"]}>{review.user?.name || "Anonymous"}</span>
                      <span className={styles["review-card__date"]}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles["review-card__stars"]}>{stars(review.rating)}</div>
                    <p className={styles["review-card__text"]}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                  No reviews yet for this product.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className={styles.pdp__related}>
          <h2 className={styles["pdp__related-title"]}>You May Also Like</h2>
          <div className={styles["pdp__related-grid"]}>
            {relatedProducts.map((p) => {
              const rPrice = Number(p.price) || 0;
              const rCompare = p.compareAtPrice ? Number(p.compareAtPrice) : null;
              const rDiscount = rCompare && rCompare > rPrice
                ? `−${Math.round(((rCompare - rPrice) / rCompare) * 100)}%`
                : null;
              const rImage = p.images?.[0]?.url || "";

              return (
                <Link key={p.id} href={`/products/${p.slug}`} className={homeStyles["product-card"]}>
                  <div className={homeStyles["product-card__image"]}>
                    {rImage ? (
                      <img src={rImage} alt={p.name} className={homeStyles["product-card__img"]} />
                    ) : (
                      <div className={homeStyles["product-card__image-placeholder"]}>📦</div>
                    )}
                    {rDiscount && <span className={homeStyles["product-card__discount-badge"]}>{rDiscount}</span>}
                  </div>
                  <div className={homeStyles["product-card__body"]}>
                    <span className={`${homeStyles["product-card__status"]} ${p.stock > 0 ? homeStyles["product-card__status--in-stock"] : homeStyles["product-card__status--out-of-stock"]}`}>
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    <span className={homeStyles["product-card__brand"]}>{p.brand?.name}</span>
                    <span className={homeStyles["product-card__name"]}>{p.name}</span>
                    <div className={homeStyles["product-card__pricing"]}>
                      <span className={homeStyles["product-card__price"]}>৳{rPrice.toLocaleString("en-BD")}</span>
                      {rCompare && <span className={homeStyles["product-card__price-original"]}>৳{rCompare.toLocaleString("en-BD")}</span>}
                      {rDiscount && <span className={homeStyles["product-card__price-discount"]}>{rDiscount}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
