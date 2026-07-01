"use client";

import { useState } from "react";
import styles from "./Tracking.module.css";

const mockOrder = {
  id: "INV-2026-001547",
  date: "Jun 30, 2026",
  status: "shipped" as const,
  payment: "Cash on Delivery",
  items: [
    { name: "Wireless ANC Earbuds Pro", qty: 1, price: 2990 },
    { name: "Smart LED Strip 5M RGB", qty: 2, price: 1290 },
  ],
  shippingCost: 60,
  total: 5630,
  timeline: [
    { step: "Order Placed", time: "Jun 30, 2:15 PM", desc: "Your order has been confirmed.", status: "completed" as const },
    { step: "Payment Confirmed", time: "Jun 30, 2:15 PM", desc: "Cash on delivery selected.", status: "completed" as const },
    { step: "Processing", time: "Jun 30, 4:30 PM", desc: "Order is being packed at our warehouse.", status: "completed" as const },
    { step: "Shipped", time: "Jul 1, 10:22 AM", desc: "Handed over to Pathao courier. Tracking: PTH-78291", status: "active" as const },
    { step: "Out for Delivery", time: "", desc: "Your package is on its way.", status: "upcoming" as const },
    { step: "Delivered", time: "", desc: "Package delivered successfully.", status: "upcoming" as const },
  ],
};

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) setShowResult(true);
  };

  return (
    <div className={`container ${styles["tracking-page"]}`}>
      <h1 className={styles["tracking-page__title"]}>Track Your Order</h1>
      <p className={styles["tracking-page__subtitle"]}>
        Enter your order ID or tracking number to check delivery status — no login required.
      </p>

      {/* Search Form */}
      <form className={styles["tracking-form"]} onSubmit={handleTrack}>
        <input
          type="text"
          className={styles["tracking-input"]}
          placeholder="e.g. INV-2026-001547"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          id="tracking-input"
        />
        <button type="submit" className="btn btn--primary btn--lg" id="track-btn">
          Track
        </button>
      </form>

      {/* Result */}
      {showResult && (
        <div className={styles["order-card"]}>
          {/* Header */}
          <div className={styles["order-card__header"]}>
            <div>
              <div className={styles["order-card__id"]}>{mockOrder.id}</div>
              <div className={styles["order-card__date"]}>Placed on {mockOrder.date}</div>
            </div>
            <span className={`${styles["status-badge"]} ${styles[`status-badge--${mockOrder.status}`]}`}>
              {mockOrder.status}
            </span>
          </div>

          {/* Timeline */}
          <div className={styles.timeline}>
            {mockOrder.timeline.map((step, i) => (
              <div
                key={i}
                className={`${styles.timeline__step} ${styles[`timeline__step--${step.status}`]}`}
              >
                <div className={`${styles.timeline__dot} ${styles[`timeline__dot--${step.status}`]}`}>
                  {step.status === "completed" ? "✓" : step.status === "active" ? "●" : (i + 1)}
                </div>
                <div className={styles.timeline__content}>
                  <div className={styles["timeline__step-title"]}>{step.step}</div>
                  {step.time && (
                    <div className={styles["timeline__step-time"]}>{step.time}</div>
                  )}
                  <div className={styles["timeline__step-desc"]}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className={styles["order-items"]}>
            <div className={styles["order-items__title"]}>Order Items</div>
            {mockOrder.items.map((item, i) => (
              <div key={i} className={styles["order-item-row"]}>
                <span className={styles["order-item-row__name"]}>{item.name}</span>
                <span className={styles["order-item-row__qty"]}>×{item.qty}</span>
                <span className={styles["order-item-row__price"]}>{formatBDT(item.price * item.qty)}</span>
              </div>
            ))}
            <div className={styles["order-item-row"]}>
              <span className={styles["order-item-row__name"]}>Shipping</span>
              <span className={styles["order-item-row__qty"]}></span>
              <span className={styles["order-item-row__price"]}>{formatBDT(mockOrder.shippingCost)}</span>
            </div>
          </div>

          {/* Footer Total */}
          <div className={styles["order-footer"]}>
            <span className={styles["order-footer__total-label"]}>Total</span>
            <span className={styles["order-footer__total-value"]}>{formatBDT(mockOrder.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
