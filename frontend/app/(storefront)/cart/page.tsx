"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import styles from "./Cart.module.css";

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function CartPage() {
  const { items, loading, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate totals using shared cart data
  const totalOriginal = items.reduce((sum, item) => {
    const comparePrice = Number(item.product.compareAtPrice) || Number(item.product.price) || 0;
    return sum + comparePrice * item.quantity;
  }, 0);
  const totalDiscount = totalOriginal - subtotal;
  const shippingCost = subtotal > 5000 ? 0 : 60;
  const total = subtotal + shippingCost;

  if (loading) {
    return (
      <div className={`container ${styles["cart-page"]}`}>
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>
          Loading cart...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`container ${styles["cart-page"]}`}>
        <div className={styles["cart-empty"]}>
          <div className={styles["cart-empty__icon"]}>🛒</div>
          <h2 className={styles["cart-empty__title"]}>Your cart is empty</h2>
          <p className={styles["cart-empty__text"]}>
            Looks like you haven&apos;t added anything yet. Explore our collection!
          </p>
          <Link href="/products" className="btn btn--primary btn--lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles["cart-page"]}`}>
      <h1 className={styles["cart-page__title"]}>
        Shopping Cart ({cartCount})
      </h1>

      <div className={styles["cart-layout"]}>
        {/* Cart Items */}
        <div className={styles["cart-items"]}>
          {items.map((item) => {
            const price = Number(item.product.price) || 0;
            const comparePrice = Number(item.product.compareAtPrice) || 0;
            const imageUrl = item.product.images?.[0]?.url;
            const productSlug = item.product.slug;
            const productHref = productSlug ? `/products/${productSlug}` : "/products";

            return (
              <div key={item.id} className={styles["cart-item"]} id={`cart-item-${item.id}`}>
                <Link href={productHref} className={styles["cart-item__image"]}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--border-radius-md)" }} />
                  ) : (
                    <div className={styles["cart-item__image-placeholder"]}>📦</div>
                  )}
                </Link>

                <div className={styles["cart-item__details"]}>
                  <Link href={productHref} className={styles["cart-item__name"]}>
                    {item.product.name}
                  </Link>
                  <span className={styles["cart-item__variant"]}>
                    {item.product.brand?.name || ""}
                  </span>
                  {item.product.stock > 0 && (
                    <span className={`${styles["cart-item__status"]} ${styles["cart-item__status--in-stock"]}`}>
                      In Stock
                    </span>
                  )}

                  <div className={styles["cart-item__actions"]}>
                    <div className={styles["cart-item__quantity"]}>
                      <button
                        className={styles["cart-item__qty-btn"]}
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.id, item.quantity - 1)
                            : removeItem(item.id)
                        }
                      >
                        −
                      </button>
                      <span className={styles["cart-item__qty-value"]}>{item.quantity}</span>
                      <button
                        className={styles["cart-item__qty-btn"]}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles["cart-item__remove"]}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                    <button className={styles["cart-item__wishlist"]}>
                      Save for later
                    </button>
                  </div>
                </div>

                <div className={styles["cart-item__price-col"]}>
                  <span className={styles["cart-item__price"]}>
                    {formatBDT(price * item.quantity)}
                  </span>
                  {comparePrice > 0 && comparePrice > price && (
                    <>
                      <span className={styles["cart-item__price-original"]}>
                        {formatBDT(comparePrice * item.quantity)}
                      </span>
                      <span className={styles["cart-item__price-saved"]}>
                        −{formatBDT((comparePrice - price) * item.quantity)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className={styles["order-summary"]} id="order-summary">
          <h2 className={styles["order-summary__title"]}>Order Summary</h2>

          <div className={styles["order-summary__row"]}>
            <span>Subtotal ({cartCount} items)</span>
            <span className={styles["order-summary__row-value"]}>{formatBDT(subtotal)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className={`${styles["order-summary__row"]} ${styles["order-summary__row--discount"]}`}>
              <span>Discount</span>
              <span className={styles["order-summary__row-value"]}>−{formatBDT(totalDiscount)}</span>
            </div>
          )}

          <div className={styles["order-summary__row"]}>
            <span>Shipping</span>
            <span className={styles["order-summary__row-value"]}>
              {shippingCost === 0 ? (
                <span style={{ color: "var(--color-circuit-green)" }}>Free</span>
              ) : (
                formatBDT(shippingCost)
              )}
            </span>
          </div>

          {shippingCost > 0 && (
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              Free shipping on orders over ৳5,000
            </div>
          )}

          {/* Coupon */}
          <form className={styles["coupon-form"]} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className={styles["coupon-input"]}
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              id="coupon-input"
            />
            <button type="submit" className="btn btn--secondary btn--sm">
              Apply
            </button>
          </form>

          <div className={styles["order-summary__total"]}>
            <span className={styles["order-summary__total-label"]}>Total</span>
            <span className={styles["order-summary__total-value"]}>{formatBDT(total)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className={styles["order-summary__savings"]}>
              You&apos;re saving {formatBDT(totalDiscount)} on this order!
            </div>
          )}

          <Link href="/checkout" className="btn btn--primary btn--lg btn--block" id="checkout-btn">
            Proceed to Checkout
          </Link>

          {/* Trust */}
          <div className={styles["cart-trust"]}>
            <div className={styles["cart-trust__item"]}>
              <span className={styles["cart-trust__icon"]}>🔒</span>
              Secure checkout with SSL encryption
            </div>
            <div className={styles["cart-trust__item"]}>
              <span className={styles["cart-trust__icon"]}>💰</span>
              Cash on delivery available
            </div>
            <div className={styles["cart-trust__item"]}>
              <span className={styles["cart-trust__icon"]}>↩️</span>
              Easy returns within 7 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
