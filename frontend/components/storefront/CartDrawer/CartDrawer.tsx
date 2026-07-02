"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import styles from "./CartDrawer.module.css";

/* ── SVG Icons ── */
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, loading, subtotal, updateQuantity, removeItem } = useCart();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={`${styles["cart-overlay"]} ${isOpen ? styles["cart-overlay--visible"] : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`${styles["cart-drawer"]} ${isOpen ? styles["cart-drawer--open"] : ""}`}
        aria-label="Shopping cart"
        id="cart-drawer"
      >
        {/* Header */}
        <div className={styles["cart-drawer__header"]}>
          <h2 className={styles["cart-drawer__title"]}>
            Shopping Cart
            {cartCount > 0 && (
              <span className={styles["cart-drawer__count"]}>{cartCount}</span>
            )}
          </h2>
          <button
            className={styles["cart-drawer__close"]}
            onClick={onClose}
            aria-label="Close cart"
            id="cart-drawer-close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className={styles["cart-loading"]}>
            <div className={styles["cart-loading__spinner"]} />
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className={styles["cart-empty"]}>
            <div className={styles["cart-empty__icon"]}>🛒</div>
            <h3 className={styles["cart-empty__title"]}>Your cart is empty</h3>
            <p className={styles["cart-empty__text"]}>
              Explore our collection and add your favourite gadgets!
            </p>
            <Link
              href="/products"
              className={styles["cart-drawer__checkout-btn"]}
              onClick={onClose}
              style={{ marginTop: "var(--space-2, 0.5rem)", maxWidth: 200 }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className={styles["cart-drawer__items"]}>
            {items.map((item, index) => {
              const price = Number(item.product.price) || 0;
              const imageUrl = item.product.images?.[0]?.url;
              const imageAlt = item.product.images?.[0]?.alt || item.product.name;

              return (
                <div
                  key={item.id}
                  className={styles["cart-item"]}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    className={styles["cart-item__image"]}
                    onClick={onClose}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={imageAlt} />
                    ) : (
                      <div className={styles["cart-item__image-placeholder"]}>📦</div>
                    )}
                  </Link>

                  <div className={styles["cart-item__info"]}>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className={styles["cart-item__name"]}
                      onClick={onClose}
                    >
                      {item.product.name}
                    </Link>
                    {item.product.brand && (
                      <span className={styles["cart-item__brand"]}>
                        {item.product.brand.name}
                      </span>
                    )}
                    <div className={styles["cart-item__bottom"]}>
                      <span className={styles["cart-item__price"]}>
                        {formatBDT(price * item.quantity)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className={styles["cart-item__controls"]}>
                          <button
                            className={styles["cart-item__qty-btn"]}
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.id, item.quantity - 1)
                                : removeItem(item.id)
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles["cart-item__qty-value"]}>
                            {item.quantity}
                          </span>
                          <button
                            className={styles["cart-item__qty-btn"]}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className={styles["cart-item__remove"]}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer with totals - only show when there are items */}
        {!loading && items.length > 0 && (
          <div className={styles["cart-drawer__footer"]}>
            <div className={styles["cart-drawer__subtotal"]}>
              <span className={styles["cart-drawer__subtotal-label"]}>Subtotal</span>
              <span className={styles["cart-drawer__subtotal-value"]}>
                {formatBDT(subtotal)}
              </span>
            </div>
            <p className={styles["cart-drawer__shipping-note"]}>
              {subtotal >= 5000
                ? <>🎉 You qualify for <strong>free shipping!</strong></>
                : <>Spend ৳{(5000 - subtotal).toLocaleString("en-BD")} more for <strong>free shipping</strong></>
              }
            </p>
            <div className={styles["cart-drawer__actions"]}>
              <Link
                href="/checkout"
                className={styles["cart-drawer__checkout-btn"]}
                onClick={onClose}
                id="cart-drawer-checkout"
              >
                Checkout <ArrowRightIcon />
              </Link>
              <Link
                href="/cart"
                className={styles["cart-drawer__view-cart-btn"]}
                onClick={onClose}
                id="cart-drawer-view-cart"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
