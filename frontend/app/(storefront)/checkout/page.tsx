"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { orderApi } from "@/lib/api";
import styles from "./Checkout.module.css";
import cartStyles from "../cart/Cart.module.css";
import { 
  MapPin, 
  Truck, 
  Building, 
  Globe, 
  CreditCard, 
  Coins, 
  Smartphone, 
  Phone, 
  Package,
  ShieldCheck
} from "lucide-react";

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

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

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

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = subtotal * (appliedCoupon.discountValue / 100);
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const shippingCost = deliveryZone === "dhaka" ? 60 : 120;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await orderApi.validateCoupon(couponCode.trim(), subtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponError(null);
      }
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

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
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId || undefined,
        })),
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
        <div style={{ display: "flex", justifyContent: "center", fontSize: "4rem", marginBottom: "var(--space-4)", color: "var(--color-circuit-green)" }}>
          <ShieldCheck size={64} />
        </div>
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
            <span style={{ color: "var(--color-text-secondary)" }}>Subtotal:</span>
            <span>{formatBDT(Number(placedOrder.subtotal))}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-1)" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Shipping:</span>
            <span>{formatBDT(Number(placedOrder.shippingCost))}</span>
          </div>
          {Number(placedOrder.discount) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-1)", color: "var(--color-circuit-green)" }}>
              <span>Discount:</span>
              <span>-{formatBDT(Number(placedOrder.discount))}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)", paddingTop: "var(--space-2)", borderTop: "var(--border-hairline)" }}>
            <span style={{ fontWeight: "var(--weight-semibold)" }}>Total Amount ({placedOrder.paymentMethod}):</span>
            <strong>{formatBDT(Number(placedOrder.total))}</strong>
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
                  <span className={styles["checkout-section__title-icon"]}><MapPin size={20} /></span>
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
                  <span className={styles["checkout-section__title-icon"]}><Truck size={20} /></span>
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
                    <span className={styles["delivery-zone__icon"]}><Building size={20} /></span>
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
                    <span className={styles["delivery-zone__icon"]}><Globe size={20} /></span>
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
                  <span className={styles["checkout-section__title-icon"]}><CreditCard size={20} /></span>
                  Payment Method
                </h2>
                <div className={styles["payment-options"]}>
                  <div
                    className={`${styles["payment-option"]} ${paymentMethod === "cod" ? styles["payment-option--active"] : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className={styles["payment-option__radio"]} />
                    <span className={styles["payment-option__icon"]}><Coins size={20} /></span>
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
                    <span className={styles["payment-option__icon"]}><Smartphone size={20} /></span>
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
                    <span className={styles["payment-option__icon"]}><Phone size={20} /></span>
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
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-2)", color: "var(--color-signal-amber)" }}>
                      <Smartphone size={36} />
                    </div>
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
                  <span className={styles["checkout-section__title-icon"]}><Package size={20} /></span>
                  Order Items
                </h2>
                <div className={styles["review-items"]}>
                  {items.map((item) => (
                    <div key={item.id} className={styles["review-item"]}>
                      <div className={styles["review-item__image"]}>
                        {item.product.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--border-radius-sm)" }} />
                        ) : (
                          <div className={styles["review-item__image-placeholder"]}><Package size={16} /></div>
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
                  <span className={styles["checkout-section__title-icon"]}><MapPin size={20} /></span>
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
                  <span className={styles["checkout-section__title-icon"]}><CreditCard size={20} /></span>
                  Payment Method
                </h2>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  {paymentMethod === "cod" && <><Coins size={16} /> Cash on Delivery</>}
                  {paymentMethod === "banglaqr" && <><Smartphone size={16} /> BanglaQR</>}
                  {paymentMethod === "bkash" && <><Phone size={16} /> bKash / Nagad</>}
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
                    <div className={styles["review-item__image-placeholder"]}><Package size={16} /></div>
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
          {discount > 0 && (
            <div className={cartStyles["order-summary__row"]} style={{ color: "var(--color-circuit-green)" }}>
              <span>Discount</span>
              <span className={cartStyles["order-summary__row-value"]}>-{formatBDT(discount)}</span>
            </div>
          )}

          <div className={cartStyles["order-summary__total"]}>
            <span className={cartStyles["order-summary__total-label"]}>Total</span>
            <span className={cartStyles["order-summary__total-value"]}>{formatBDT(total)}</span>
          </div>

          {/* Coupon Code Section */}
          <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "var(--border-divider)" }}>
            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-2)" }}>Promo / Coupon Code</h3>
            
            {appliedCoupon ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "var(--space-2) var(--space-3)", 
                background: "rgba(16, 185, 129, 0.08)", 
                border: "1px solid rgba(16, 185, 129, 0.2)", 
                borderRadius: "var(--border-radius-md)" 
              }}>
                <div style={{ fontSize: "var(--text-sm)" }}>
                  <span style={{ fontWeight: "var(--weight-bold)", color: "var(--color-circuit-green)", marginRight: "var(--space-2)" }}>{appliedCoupon.code}</span>
                  <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>
                    ({appliedCoupon.discountType === "PERCENTAGE" ? `${appliedCoupon.discountValue}%` : `৳${appliedCoupon.discountValue}`} Off)
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => handleRemoveCoupon(e)}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "var(--color-status-cancelled)", 
                    cursor: "pointer", 
                    fontWeight: "var(--weight-semibold)", 
                    fontSize: "var(--text-xs)" 
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "var(--space-2)" }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={couponLoading}
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    padding: "var(--space-2) var(--space-3)",
                    backgroundColor: "var(--color-bg)",
                    border: "var(--border-hairline)",
                    borderRadius: "var(--border-radius-md)",
                    color: "var(--color-text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="btn btn--secondary btn--sm"
                  style={{ fontSize: "var(--text-xs)", padding: "var(--space-2) var(--space-4)" }}
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </form>
            )}
            
            {couponError && (
              <div style={{ 
                color: "var(--color-status-cancelled)", 
                fontSize: "var(--text-xs)", 
                marginTop: "var(--space-1)" 
              }}>
                {couponError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
