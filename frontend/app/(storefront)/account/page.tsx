"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Account.module.css";
import trackStyles from "../track/Tracking.module.css";
import { useWishlist } from "@/components/providers/WishlistContext";

const orders = [
  { id: "INV-2026-001547", date: "Jun 30, 2026", items: 3, total: 5630, status: "shipped" as const },
  { id: "INV-2026-001490", date: "Jun 25, 2026", items: 1, total: 8990, status: "delivered" as const },
  { id: "INV-2026-001322", date: "Jun 10, 2026", items: 2, total: 3780, status: "delivered" as const },
  { id: "INV-2026-001201", date: "May 28, 2026", items: 1, total: 490, status: "delivered" as const },
  { id: "INV-2026-001089", date: "May 15, 2026", items: 4, total: 12560, status: "cancelled" as const },
];



function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { items: wishlistItems } = useWishlist();

  const navItems = [
    { icon: "📦", label: "Orders", key: "orders", badge: "2" },
    { icon: "👤", label: "Profile", key: "profile" },
    { icon: "📍", label: "Addresses", key: "addresses" },
    { icon: "❤️", label: "Wishlist", key: "wishlist", badge: wishlistItems.length > 0 ? String(wishlistItems.length) : undefined },
    { icon: "🔔", label: "Notifications", key: "notifications" },
  ];

  return (
    <div className={`container ${styles["account-page"]}`}>
      <div className={styles["account-layout"]}>
        {/* Sidebar */}
        <aside className={styles["account-sidebar"]}>
          <div className={styles["account-profile"]}>
            <div className={styles["account-avatar"]}>RA</div>
            <div>
              <div className={styles["account-profile__name"]}>Rahim Ahmed</div>
              <div className={styles["account-profile__phone"]}>+880 1712345678</div>
            </div>
          </div>

          <nav className={styles["account-nav"]}>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`${styles["account-nav__link"]} ${activeTab === item.key ? styles["account-nav__link--active"] : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className={styles["account-nav__icon"]}>{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className={styles["account-nav__badge"]}>{item.badge}</span>
                )}
              </button>
            ))}
            <hr style={{ border: "none", borderTop: "var(--border-divider)", margin: "var(--space-2) 0" }} />
            <Link href="/auth" className={styles["account-nav__link"]}>
              <span className={styles["account-nav__icon"]}>🚪</span>
              Sign Out
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <div className={styles["account-content"]}>
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className={styles["account-section"]}>
              <h2 className={styles["account-section__title"]}>Order History</h2>
              <div className={styles["table-scroll"]}>
                <table className={styles["orders-table"]}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className={styles["orders-table__id"]}>{order.id}</span>
                        </td>
                        <td>
                          <span className={styles["orders-table__date"]}>{order.date}</span>
                        </td>
                        <td>{order.items} item{order.items !== 1 ? "s" : ""}</td>
                        <td>
                          <span className={styles["orders-table__total"]}>{formatBDT(order.total)}</span>
                        </td>
                        <td>
                          <span className={`${trackStyles["status-badge"]} ${trackStyles[`status-badge--${order.status}`]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link href={`/track?id=${order.id}`} className={styles["orders-table__action"]}>
                            Track →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className={styles["account-section"]}>
              <h2 className={styles["account-section__title"]}>Personal Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Full Name</label>
                  <input type="text" defaultValue="Rahim Ahmed" className="form-input" style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", padding: "var(--space-3)",
                    backgroundColor: "var(--color-bg)", border: "var(--border-hairline)",
                    borderRadius: "var(--border-radius-md)", color: "var(--color-text-primary)"
                  }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Phone</label>
                  <input type="tel" defaultValue="+880 1712345678" readOnly className="form-input" style={{
                    fontFamily: "var(--font-data)", fontSize: "var(--text-sm)", padding: "var(--space-3)",
                    backgroundColor: "var(--color-bg)", border: "var(--border-hairline)",
                    borderRadius: "var(--border-radius-md)", color: "var(--color-text-tertiary)"
                  }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Email</label>
                  <input type="email" defaultValue="rahim@example.com" className="form-input" style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", padding: "var(--space-3)",
                    backgroundColor: "var(--color-bg)", border: "var(--border-hairline)",
                    borderRadius: "var(--border-radius-md)", color: "var(--color-text-primary)"
                  }} />
                </div>
              </div>
              <div style={{ marginTop: "var(--space-4)" }}>
                <button className="btn btn--primary">Save Changes</button>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className={styles["account-section"]}>
              <h2 className={styles["account-section__title"]}>Saved Addresses</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div style={{
                  padding: "var(--space-4)", border: "var(--border-hairline)",
                  borderRadius: "var(--border-radius-md)", borderColor: "var(--color-signal-amber)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>Home</span>
                    <span style={{ fontSize: "10px", background: "var(--color-signal-amber)", color: "#fff", padding: "1px 6px", borderRadius: "var(--border-radius-full)", fontWeight: 600 }}>DEFAULT</span>
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                    House 42, Road 5, Block C<br />
                    Mirpur-10, Dhaka 1216<br />
                    <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>+880 1712345678</span>
                  </p>
                </div>
                <div style={{
                  padding: "var(--space-4)", border: "2px dashed var(--color-border)",
                  borderRadius: "var(--border-radius-md)", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "var(--color-text-tertiary)",
                  fontSize: "var(--text-sm)"
                }}>
                  + Add New Address
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className={styles["account-section"]}>
              <h2 className={styles["account-section__title"]}>Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})</h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                Your saved items will appear here. Browse products and click the heart icon to add them.
              </p>
              <Link href="/favourites" className="btn btn--primary btn--sm" style={{ display: "inline-flex" }}>
                View & Manage Favourites
              </Link>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className={styles["account-section"]}>
              <h2 className={styles["account-section__title"]}>Notification Preferences</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  { label: "Order updates", desc: "Get notified about order status changes", enabled: true },
                  { label: "Deals & promotions", desc: "Receive updates about sales and offers", enabled: true },
                  { label: "Back in stock alerts", desc: "Notified when wishlist items are available", enabled: false },
                ].map((pref) => (
                  <label key={pref.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "var(--space-3) 0", borderBottom: "var(--border-divider)"
                  }}>
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)" }}>{pref.label}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{pref.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked={pref.enabled} style={{ width: 18, height: 18, accentColor: "var(--color-signal-amber)" }} />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
