"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { orderApi } from "@/lib/api";
import styles from "./Checkout.module.css";
import cartStyles from "../cart/Cart.module.css";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart, loading: cartLoading } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");

  // Form Field States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Pre-fill user profile fields if available
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPhone(user.phone?.replace("+880", "") || "");
      setEmail(user.email || "");
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setFullName(addr.fullName || user.name || "");
        setPhone(addr.phone?.replace("+880", "") || user.phone?.replace("+880", "") || "");
        setDistrict(addr.district || "");
        setAddress(addr.address || "");
        setDeliveryZone(addr.district === "dhaka" ? "dhaka" : "outside");
      }
    }
  }, [user]);

  const shippingCost = deliveryZone === "dhaka" ? 60 : 120;
  const total = subtotal + shippingCost;

  // Handle Step 1 Validation
  const handleContinueToPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    setOrderError(null);
    if (!fullName.trim() || !phone.trim() || !district || !address.trim()) {
      setOrderError("Please fill out all required fields (*).");
      return;
    }
    setStep(2);
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setOrderError(null);

      const formattedPhone = phone.startsWith("0") ? phone : "0" + phone;

      const orderPayload: any = {
        addressData: {
          fullName,
          phone: formattedPhone,
          district,
          address,
        },
        paymentMethod: paymentMethod.toUpperCase() as any,
        deliveryZone,
        notes: notes || undefined,
      };

      const res = await orderApi.create(orderPayload);
      if (res && res.order) {
        setPlacedOrder(res.order);
        clearCart(); // clear cart on success
      } else {
        throw new Error("Failed to create order");
      }
    } catch (err: any) {
      console.error("Order creation error:", err);
      setOrderError(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0", color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>
        Loading checkout details...
      </div>
    );
  }

  // If not logged in, request login first
  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: "100px auto", padding: "var(--space-6)", backgroundColor: "var(--color-surface)", border: "var(--border-hairline)", borderRadius: "var(--border-radius-md)", textAlign: "center" }}>
        <h2 style={{ marginBottom: "var(--space-4)" }}>🔒 Checkout Required Sign In</h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>
          Please log in or create an account to complete your purchase.
        </p>
        <Link href={`/auth?redirect=/checkout`} className="btn btn--primary btn--lg btn--block">
          Login / Register
        </Link>
      </div>
    );
  }

  // If cart is empty and order is not placed yet
  if (items.length === 0 && !placedOrder) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--color-text-tertiary)", marginTop: "var(--space-2)" }}>Add some products to cart before checking out.</p>
        <Link href="/products" className="btn btn--primary" style={{ marginTop: "var(--space-4)" }}>Browse Products</Link>
      </div>
    );
  }

  // Order Success Screen
  if (placedOrder) {
    return (
      <div className="container" style={{ maxWidth: 600, margin: "60px auto", padding: "var(--space-8)", backgroundColor: "var(--color-surface)", border: "var(--border-hairline)", borderRadius: "var(--border-radius-md)", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)" }}>🎉</div>
        <h2 style={{ marginBottom: "var(--space-2)" }}>Order Placed Successfully!</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          Thank you for your purchase. Your order number is{" "}
          <strong style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-data)" }}>
            {placedOrder.orderNumber}
          </strong>
        </p>
        <div style={{
          margin: "var(--space-6) 0",
          padding: "var(--space-4)",
          background: "var(--color-bg)",
          borderRadius: "var(--border-radius-md)",
          textAlign: "left",
          fontSize: "var(--text-sm)"
        }}>
          <h4 style={{ marginBottom: "var(--space-2)" }}>Delivery Address</h4>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {fullName}<br />
            {phone}<br />
            {address}, {district}
          </p>
          <h4 style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>Payment Summary</h4>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Total Paid (COD):</span>
            <strong>{formatBDT(total)}</strong>
          </div>
        </div>
        <Link href="/" className="btn btn--primary btn--lg btn--block">
          Continue Shopping
        </Link>
      </div>
    );
  }

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

      {orderError && (
        <div style={{
          color: "#ff4d4d",
          backgroundColor: "rgba(255, 77, 77, 0.1)",
          padding: "var(--space-3)",
          borderRadius: "var(--border-radius-md)",
          fontSize: "var(--text-sm)",
          marginBottom: "var(--space-4)",
          border: "1px solid rgba(255, 77, 77, 0.2)"
        }}>
          {orderError}
        </div>
      )}

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
                    <input type="text" className={styles["form-input"]} placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} id="shipping-name" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>
                      Phone Number <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <input type="tel" className={styles["form-input"]} placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} id="shipping-phone" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>Email (optional)</label>
                    <input type="email" className={styles["form-input"]} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} id="shipping-email" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className={styles["form-label"]}>
                      District <span className={styles["form-label__required"]}>*</span>
                    </label>
                    <select
                      className={styles["form-select"]}
                      value={district}
                      onChange={(e) => {
                        const dist = e.target.value;
                        setDistrict(dist);
                        setDeliveryZone(dist === "dhaka" ? "dhaka" : "outside");
                      }}
                      id="shipping-district"
                    >
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
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      id="shipping-address"
                    />
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-group--full"]}`}>
                    <label className={styles["form-label"]}>Order Notes (optional)</label>
                    <textarea
                      className={styles["form-textarea"]}
                      placeholder="Special delivery instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                    onClick={() => {
                      setDeliveryZone("dhaka");
                      setDistrict("dhaka");
                    }}
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
                    onClick={() => {
                      setDeliveryZone("outside");
                      if (district === "dhaka") setDistrict("");
                    }}
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
                <button className="btn btn--primary btn--lg btn--block" onClick={handleContinueToPayment} id="to-payment-btn">
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
                  {items.map((item) => (
                    <div key={item.id} className={styles["review-item"]}>
                      <div className={styles["review-item__image"]}>
                        {item.product.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--border-radius-sm)" }} />
                        ) : (
                          <div className={styles["review-item__image-placeholder"]}>📦</div>
                        )}
                      </div>
                      <div className={styles["review-item__info"]}>
                        <div className={styles["review-item__name"]}>{item.product.name}</div>
                        <div className={styles["review-item__qty"]}>Qty: {item.quantity}</div>
                      </div>
                      <div className={styles["review-item__price"]}>
                        {formatBDT((Number(item.product.price) || 0) * item.quantity)}
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
                <button className="btn btn--primary btn--lg btn--block" id="place-order-btn" onClick={handlePlaceOrder} disabled={placingOrder}>
                  {placingOrder ? "Placing Order..." : `Place Order — ${formatBDT(total)}`}
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
            {items.map((item) => (
              <div key={item.id} className={styles["review-item"]}>
                <div className={styles["review-item__image"]}>
                  {item.product.images?.[0]?.url ? (
                    <img src={item.product.images[0].url} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--border-radius-sm)" }} />
                  ) : (
                    <div className={styles["review-item__image-placeholder"]}>📦</div>
                  )}
                </div>
                <div className={styles["review-item__info"]}>
                  <div className={styles["review-item__name"]}>{item.product.name}</div>
                  <div className={styles["review-item__qty"]}>×{item.quantity}</div>
                </div>
                <div className={styles["review-item__price"]}>
                  {formatBDT((Number(item.product.price) || 0) * item.quantity)}
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
