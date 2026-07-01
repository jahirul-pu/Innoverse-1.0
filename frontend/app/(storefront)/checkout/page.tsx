"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Checkout.module.css";
import cartStyles from "../cart/Cart.module.css";

/* ── Mock Order Items ── */
const orderItems = [
  { id: 1, name: "Wireless ANC Earbuds Pro", qty: 1, price: 2990 },
  { id: 3, name: "Smart LED Strip 5M RGB", qty: 2, price: 1290 },
  { id: 6, name: "65W GaN Charger", qty: 1, price: 1790 },
];

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = deliveryZone === "dhaka" ? 60 : 120;
  const total = subtotal + shippingCost;

  return (
    <div className={`container ${styles["checkout-page"]}`}>
      <h1 className={styles["checkout-page__title"]}>Checkout</h1>

      {/* Steps */}
      <div className={styles["checkout-steps"]}>
        {["Shipping", "Payment", "Review"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            {i > 0 && (
              <div
                className={styles["checkout-step__connector"]}
                style={{ backgroundColor: i <= step - 1 ? "var(--color-circuit-green)" : undefined }}
              />
            )}
            <div
              className={`${styles["checkout-step"]} ${
                i + 1 === step
                  ? styles["checkout-step--active"]
                  : i + 1 < step
                  ? styles["checkout-step--completed"]
                  : styles["checkout-step--upcoming"]
              }`}
              style={{ cursor: i + 1 < step ? "pointer" : "default" }}
              onClick={() => { if (i + 1 < step) setStep(i + 1); }}
            >
              <span className={styles["checkout-step__number"]}>
                {i + 1 < step ? "✓" : i + 1}
              </span>
              <span className={styles["checkout-step__label"]}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles["checkout-layout"]}>
        {/* Main Form Area */}
        <div>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <>
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>📍</span>
                  Shipping Address
                </h2>
                <div className={styles["form-grid"]}>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>
                      Full Name <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <input type="text" className={styles["form-input"]} placeholder="Enter your full name" id="shipping-name" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>
                      Phone Number <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <input type="tel" className={styles["form-input"]} placeholder="01XXXXXXXXX" id="shipping-phone" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>Email (optional)</label>
                    <input type="email" className={styles["form-input"]} placeholder="your@email.com" id="shipping-email" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>
                      District <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <select className={styles["form-select"]} id="shipping-district">
                      <option value="">Select district</option>
                      <option value="dhaka">Dhaka</option>
                      <option value="chittagong">Chittagong</option>
                      <option value="sylhet">Sylhet</option>
                      <option value="rajshahi">Rajshahi</option>
                      <option value="khulna">Khulna</option>
                      <option value="barisal">Barisal</option>
                      <option value="rangpur">Rangpur</option>
                      <option value="mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-group--full"]}`}>
                    <label className={styles["form-label"]}>
                      Full Address <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <textarea
                      className={styles["form-textarea"]}
                      placeholder="House no, Road no, Area, City"
                      id="shipping-address"
                    />
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-group--full"]}`}>
                    <label className={styles["form-label"]}>Order Notes (optional)</label>
                    <textarea
                      className={styles["form-textarea"]}
                      placeholder="Special delivery instructions..."
                      id="shipping-notes"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Zone */}
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>🚚</span>
                  Delivery Zone
                </h2>
                <div className={styles["delivery-zones"]}>
                  <div
                    className={`${styles["delivery-zone"]} ${deliveryZone === "dhaka" ? styles["delivery-zone--active"] : ""}`}
                    onClick={() => setDeliveryZone("dhaka")}
                  >
                    <span className={styles["delivery-zone__icon"]}>🏙️</span>
                    <span className={styles["delivery-zone__name"]}>Inside Dhaka</span>
                    <div className={styles["delivery-zone__details"]}>
                      <span className={styles["delivery-zone__time"]}>1–2 business days</span>
                      <span className={styles["delivery-zone__cost"]}>৳60</span>
                    </div>
                  </div>
                  <div
                    className={`${styles["delivery-zone"]} ${deliveryZone === "outside" ? styles["delivery-zone--active"] : ""}`}
                    onClick={() => setDeliveryZone("outside")}
                  >
                    <span className={styles["delivery-zone__icon"]}>🌏</span>
                    <span className={styles["delivery-zone__name"]}>Outside Dhaka</span>
                    <div className={styles["delivery-zone__details"]}>
                      <span className={styles["delivery-zone__time"]}>3–5 business days</span>
                      <span className={styles["delivery-zone__cost"]}>৳120</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["checkout-actions"]}>
                <button className="btn btn--primary btn--lg btn--block" onClick={() => setStep(2)} id="to-payment-btn">
                  Continue to Payment
                </button>
                <Link href="/cart" className="btn btn--secondary btn--lg btn--block" style={{ textAlign: "center" }}>
                  ← Back to Cart
                </Link>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <>
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>💳</span>
                  Payment Method
                </h2>
                <div className={styles["payment-options"]}>
                  <div
                    className={`${styles["payment-option"]} ${paymentMethod === "cod" ? styles["payment-option--active"] : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className={styles["payment-option__radio"]} />
                    <span className={styles["payment-option__icon"]}>💰</span>
                    <div className={styles["payment-option__info"]}>
                      <span className={styles["payment-option__name"]}>Cash on Delivery</span>
                      <span className={styles["payment-option__desc"]}>Pay when you receive your order</span>
                    </div>
                    <span className={styles["payment-option__badge"]}>Popular</span>
                  </div>

                  <div
                    className={`${styles["payment-option"]} ${paymentMethod === "banglaqr" ? styles["payment-option--active"] : ""}`}
                    onClick={() => setPaymentMethod("banglaqr")}
                  >
                    <div className={styles["payment-option__radio"]} />
                    <span className={styles["payment-option__icon"]}>📱</span>
                    <div className={styles["payment-option__info"]}>
                      <span className={styles["payment-option__name"]}>BanglaQR</span>
                      <span className={styles["payment-option__desc"]}>Scan QR with any banking app (bKash, Nagad, bank apps)</span>
                    </div>
                  </div>

                  <div
                    className={`${styles["payment-option"]} ${paymentMethod === "bkash" ? styles["payment-option--active"] : ""}`}
                    onClick={() => setPaymentMethod("bkash")}
                  >
                    <div className={styles["payment-option__radio"]} />
                    <span className={styles["payment-option__icon"]}>📲</span>
                    <div className={styles["payment-option__info"]}>
                      <span className={styles["payment-option__name"]}>bKash / Nagad</span>
                      <span className={styles["payment-option__desc"]}>Mobile wallet payment</span>
                    </div>
                  </div>
                </div>

                {paymentMethod === "banglaqr" && (
                  <div style={{
                    marginTop: "var(--space-4)",
                    padding: "var(--space-4)",
                    background: "var(--color-bg)",
                    borderRadius: "var(--border-radius-md)",
                    border: "var(--border-hairline)",
                    textAlign: "center",
                    color: "var(--color-text-tertiary)",
                    fontSize: "var(--text-sm)",
                  }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-2)" }}>📱</div>
                    QR code will be generated after you place the order.
                    <br />
                    Scan with bKash, Nagad, or any banking app.
                  </div>
                )}
              </div>

              <div className={styles["checkout-actions"]}>
                <button className="btn btn--primary btn--lg btn--block" onClick={() => setStep(3)} id="to-review-btn">
                  Review Order
                </button>
                <button className="btn btn--secondary btn--lg btn--block" onClick={() => setStep(1)}>
                  ← Back to Shipping
                </button>
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              {/* Items Review */}
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>📦</span>
                  Order Items
                </h2>
                <div className={styles["review-items"]}>
                  {orderItems.map((item) => (
                    <div key={item.id} className={styles["review-item"]}>
                      <div className={styles["review-item__image"]}>
                        <div className={styles["review-item__image-placeholder"]}>📦</div>
                      </div>
                      <div className={styles["review-item__info"]}>
                        <div className={styles["review-item__name"]}>{item.name}</div>
                        <div className={styles["review-item__qty"]}>Qty: {item.qty}</div>
                      </div>
                      <div className={styles["review-item__price"]}>
                        {formatBDT(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Summary */}
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>📍</span>
                  Shipping Details
                </h2>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                  <strong>Delivery Zone:</strong> {deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                  <br />
                  <strong>Est. Delivery:</strong>{" "}
                  <span style={{ color: "var(--color-trace-blue)" }}>
                    {deliveryZone === "dhaka" ? "1–2 business days" : "3–5 business days"}
                  </span>
                  <br />
                  <strong>Shipping Cost:</strong> {formatBDT(shippingCost)}
                </div>
              </div>

              {/* Payment Summary */}
              <div className={styles["checkout-section"]}>
                <h2 className={styles["checkout-section__title"]}>
                  <span className={styles["checkout-section__title-icon"]}>💳</span>
                  Payment Method
                </h2>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  {paymentMethod === "cod" && "💰 Cash on Delivery"}
                  {paymentMethod === "banglaqr" && "📱 BanglaQR"}
                  {paymentMethod === "bkash" && "📲 bKash / Nagad"}
                </div>
              </div>

              <div className={styles["checkout-actions"]}>
                <button className="btn btn--primary btn--lg btn--block" id="place-order-btn">
                  Place Order — {formatBDT(total)}
                </button>
                <p className={styles["checkout-actions__terms"]}>
                  By placing this order, you agree to our{" "}
                  <Link href="/terms">Terms & Conditions</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>.
                </p>
                <button className="btn btn--secondary btn--lg btn--block" onClick={() => setStep(2)}>
                  ← Back to Payment
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sticky Order Summary Sidebar */}
        <div className={cartStyles["order-summary"]} id="checkout-summary">
          <h2 className={cartStyles["order-summary__title"]}>Order Summary</h2>

          {/* Mini items list */}
          <div className={styles["review-items"]}>
            {orderItems.map((item) => (
              <div key={item.id} className={styles["review-item"]}>
                <div className={styles["review-item__image"]}>
                  <div className={styles["review-item__image-placeholder"]}>📦</div>
                </div>
                <div className={styles["review-item__info"]}>
                  <div className={styles["review-item__name"]}>{item.name}</div>
                  <div className={styles["review-item__qty"]}>×{item.qty}</div>
                </div>
                <div className={styles["review-item__price"]}>
                  {formatBDT(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <hr className={cartStyles["order-summary__divider"]} />

          <div className={cartStyles["order-summary__row"]}>
            <span>Subtotal</span>
            <span className={cartStyles["order-summary__row-value"]}>{formatBDT(subtotal)}</span>
          </div>
          <div className={cartStyles["order-summary__row"]}>
            <span>Shipping ({deliveryZone === "dhaka" ? "Dhaka" : "Outside"})</span>
            <span className={cartStyles["order-summary__row-value"]}>{formatBDT(shippingCost)}</span>
          </div>

          <div className={cartStyles["order-summary__total"]}>
            <span className={cartStyles["order-summary__total-label"]}>Total</span>
            <span className={cartStyles["order-summary__total-value"]}>{formatBDT(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
