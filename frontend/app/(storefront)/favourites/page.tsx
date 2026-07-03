"use client";

import Link from "next/link";
import { useWishlist } from "@/components/providers/WishlistContext";
import { useCart } from "@/components/providers/CartContext";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import styles from "./Favourites.module.css";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function FavouritesPage() {
  const { items, toggleWishlist, clearWishlist, loading } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = async (product: any) => {
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
    } catch (err) {
      console.error("Failed to add wishlist item to cart", err);
    }
  };

  if (loading) {
    return (
      <div className={`container ${styles.favourites}`} style={{ textAlign: "center", padding: "100px 0" }}>
        <p style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>Loading your favourites...</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.favourites}`}>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: "var(--space-6)" }}>
        <li className="breadcrumb__item">
          <Link href="/" className="breadcrumb__link">Home</Link>
        </li>
        <li className="breadcrumb__item">
          <span className="breadcrumb__current">Favourites</span>
        </li>
      </nav>

      {/* Header */}
      <div className={styles.favourites__header}>
        <div>
          <h1 className={styles.favourites__title}>My Favourites</h1>
          <p className={styles.favourites__desc}>
            {items.length === 0 
              ? "You haven't saved any items yet." 
              : `You have saved ${items.length} ${items.length === 1 ? 'item' : 'items'} in your wishlist.`
            }
          </p>
        </div>
        {items.length > 0 && (
          <button className="btn btn--secondary btn--sm" onClick={clearWishlist}>
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.favourites__empty}>
          <div className={styles["favourites__empty-icon"]}>
            <Heart size={64} strokeWidth={1.5} />
          </div>
          <h2 className={styles["favourites__empty-title"]}>Your favourites list is empty</h2>
          <p className={styles["favourites__empty-text"]}>
            Save products you like to your favourites list. They will show up here so you can easily find and order them later.
          </p>
          <Link href="/products" className="btn btn--primary">
            Start Shopping <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      ) : (
        <div className={styles.favourites__grid}>
          {items.map((item) => {
            const price = Number(item.price);
            const comparePrice = item.compareAtPrice ? Number(item.compareAtPrice) : null;
            const discount = comparePrice && comparePrice > price
              ? `−${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
              : null;
            const primaryImage = item.images?.[0]?.url;

            return (
              <div key={item.id} className={styles.fav_card} id={`fav-item-${item.id}`}>
                <Link href={`/products/${item.slug}`} className={styles.fav_card__image_wrapper}>
                  {primaryImage ? (
                    <img src={primaryImage} alt={item.name} className={styles.fav_card__image} />
                  ) : (
                    <div className={styles.fav_card__placeholder}>📦</div>
                  )}
                  {discount && (
                    <span className={styles.fav_card__discount}>{discount}</span>
                  )}
                </Link>
                <div className={styles.fav_card__body}>
                  <div>
                    <span className={styles.fav_card__brand}>{item.brand?.name || "Genuine Product"}</span>
                    <Link href={`/products/${item.slug}`} className={styles.fav_card__name}>
                      {item.name}
                    </Link>
                    <span className={`${styles.fav_card__status} ${item.stock > 0 ? styles["fav_card__status--in-stock"] : styles["fav_card__status--out-of-stock"]}`}>
                      {item.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className={styles.fav_card__footer}>
                    <div className={styles.fav_card__pricing}>
                      <span className={styles.fav_card__price}>{formatBDT(price)}</span>
                      {comparePrice && (
                        <span className={styles.fav_card__price_original}>{formatBDT(comparePrice)}</span>
                      )}
                    </div>

                    <div className={styles.fav_card__actions}>
                      <button 
                        className="btn btn--secondary btn--sm" 
                        style={{ padding: "8px" }}
                        onClick={() => toggleWishlist(item)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} style={{ color: "var(--color-status-cancelled)" }} />
                      </button>
                      <button 
                        className="btn btn--primary btn--sm"
                        disabled={item.stock <= 0}
                        onClick={() => handleAddToCart(item)}
                        style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" }}
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
