"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { Heart } from "lucide-react";
import styles from "@/app/(storefront)/Home.module.css";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    compareAtPrice?: string | number | null;
    stock: number;
    images?: Array<{ url: string }> | null;
    brand?: { name: string; slug?: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);
  const price = Number(product.price);
  const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discount = comparePrice && comparePrice > price
    ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
    : null;

  const primaryImage = product.images?.[0]?.url;

  return (
    <div className={styles["product-card"]} id={`product-card-${product.id}`}>
      <Link href={`/products/${product.slug}`} className={styles["product-card__image-link"]}>
        <div className={styles["product-card__image"]}>
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className={styles["product-card__img"]} />
          ) : (
            <div className={styles["product-card__image-placeholder"]}>📦</div>
          )}
          {discount && (
            <span className={styles["product-card__discount-badge"]}>{discount}</span>
          )}
        </div>
      </Link>

      <button
        className={`${styles["product-card__wishlist"]} ${isFavorited ? styles["product-card__wishlist--active"] : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            stock: product.stock,
            images: product.images ? product.images.map(img => ({ url: img.url, alt: null })) : [],
            brand: product.brand ? { name: product.brand.name } : undefined,
          });
        }}
        aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
      </button>

      <div className={styles["product-card__body"]}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span className={`${styles["product-card__status"]} ${product.stock > 0 ? styles["product-card__status--in-stock"] : styles["product-card__status--out-of-stock"]}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <span className={styles["product-card__brand"]}>{product.brand?.name}</span>
          <Link href={`/products/${product.slug}`} className={styles["product-card__name"]}>
            {product.name}
          </Link>
          <div className={styles["product-card__pricing"]}>
            <span className={styles["product-card__price"]}>৳{price.toLocaleString("en-BD")}</span>
            {comparePrice && (
              <span className={styles["product-card__price-original"]}>
                ৳{comparePrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>
        </div>

        <div className={styles["product-card__actions"]}>
          <button
            className="btn btn--secondary"
            disabled={product.stock <= 0}
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
                  images: product.images ? product.images.map(img => ({ url: img.url, alt: null })) : [],
                  brand: product.brand ? { name: product.brand.name } : undefined,
                });
              } catch (err) {
                console.error(err);
              }
            }}
            style={{ 
              flex: 1, 
              fontSize: "13px", 
              padding: "10px 12px", 
              fontWeight: "var(--weight-semibold)",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Add to Cart
          </button>
          <button
            className="btn btn--primary"
            disabled={product.stock <= 0}
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
                  images: product.images ? product.images.map(img => ({ url: img.url, alt: null })) : [],
                  brand: product.brand ? { name: product.brand.name } : undefined,
                });
                window.location.href = "/checkout";
              } catch (err) {
                console.error(err);
              }
            }}
            style={{ 
              flex: 1, 
              fontSize: "13px", 
              padding: "10px 12px", 
              fontWeight: "var(--weight-semibold)",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
