"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Admin.module.css";

// ─── Mock Data ──────────────────────────────────────────────
const stats = {
  revenue: { value: "৳2,45,680", change: "+12.5%", trend: "up" as const },
  orders: { value: "342", change: "+8.2%", trend: "up" as const },
  products: { value: "164", change: "+3", trend: "up" as const },
  customers: { value: "1,247", change: "+15.1%", trend: "up" as const },
};

const recentOrders = [
  { id: "INV-2026-001547", customer: "Rahim Ahmed", phone: "01712345678", items: 3, total: 5630, status: "shipped", date: "Jul 1, 2026" },
  { id: "INV-2026-001546", customer: "Fatima Begum", phone: "01898765432", items: 1, total: 8990, status: "processing", date: "Jul 1, 2026" },
  { id: "INV-2026-001545", customer: "Karim Hasan", phone: "01655443322", items: 2, total: 3780, status: "pending", date: "Jun 30, 2026" },
  { id: "INV-2026-001544", customer: "Nadia Rahman", phone: "01511223344", items: 4, total: 12560, status: "delivered", date: "Jun 30, 2026" },
  { id: "INV-2026-001543", customer: "Shakil Uddin", phone: "01944556677", items: 1, total: 2990, status: "cancelled", date: "Jun 29, 2026" },
];

const productList = [
  { name: "Wireless ANC Earbuds Pro", sku: "SC-ANC-PRO-BK", brand: "SoundCore", price: 2990, stock: 45, status: "active" },
  { name: "Noise Cancelling Headphones", sku: "SN-NC-WH1000", brand: "Sony", price: 8990, stock: 18, status: "active" },
  { name: "Smart Watch Ultra", sku: "AZ-ULTRA-WCH", brand: "Amazfit", price: 6490, stock: 3, status: "low-stock" },
  { name: "65W GaN Charger", sku: "UG-GAN65-3P", brand: "Ugreen", price: 1790, stock: 120, status: "active" },
  { name: "Mechanical Keyboard RGB", sku: "KC-MECH-RGB", brand: "Keychron", price: 5490, stock: 0, status: "inactive" },
  { name: "Action Camera 4K", sku: "GP-AC4K-HERO", brand: "GoPro", price: 22990, stock: 15, status: "active" },
  { name: "Mini Bluetooth Speaker", sku: "JBL-MINI-BT", brand: "JBL", price: 2190, stock: 0, status: "inactive" },
  { name: "Smart LED Strip 5M RGB", sku: "GV-LED-5M-RGB", brand: "Govee", price: 1290, stock: 80, status: "active" },
  { name: "Fitness Band 7 Pro", sku: "AZ-BAND7-PRO", brand: "Amazfit", price: 3490, stock: 60, status: "active" },
  { name: "USB-C Hub 7-in-1", sku: "AK-HUB7-USBC", brand: "Anker", price: 3290, stock: 4, status: "low-stock" },
];

const customerList = [
  { name: "Rahim Ahmed", phone: "01712345678", email: "rahim@example.com", orders: 5, spent: 21400, joined: "Mar 2026" },
  { name: "Fatima Begum", phone: "01898765432", email: "fatima@gmail.com", orders: 3, spent: 14890, joined: "Apr 2026" },
  { name: "Karim Hasan", phone: "01655443322", email: "—", orders: 8, spent: 42300, joined: "Jan 2026" },
  { name: "Nadia Rahman", phone: "01511223344", email: "nadia.r@yahoo.com", orders: 2, spent: 7980, joined: "May 2026" },
  { name: "Shakil Uddin", phone: "01944556677", email: "shakil@example.com", orders: 12, spent: 89100, joined: "Dec 2025" },
];

const chartBars = [35, 58, 42, 70, 55, 80, 65, 90, 75, 85, 60, 95];

type AdminView = "dashboard" | "products" | "orders" | "customers";

const navItems = [
  { icon: "📊", label: "Dashboard", key: "dashboard" as const },
  { icon: "📦", label: "Products", key: "products" as const, count: 164 },
  { icon: "🛒", label: "Orders", key: "orders" as const, count: 12 },
  { icon: "👥", label: "Customers", key: "customers" as const },
];

const navUtility = [
  { icon: "🏷️", label: "Categories" },
  { icon: "🏢", label: "Brands" },
  { icon: "🎫", label: "Coupons" },
  { icon: "📸", label: "Media" },
];

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

// ─── Dashboard View ─────────────────────────────────────────
function DashboardView() {
  return (
    <>
      {/* Stats Grid */}
      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--revenue"]}`}>💰</div>
          <div className={styles["stat-card__body"]}>
            <div className={styles["stat-card__label"]}>Total Revenue</div>
            <div className={styles["stat-card__value"]}>{stats.revenue.value}</div>
            <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
              ↑ {stats.revenue.change} this month
            </div>
          </div>
        </div>
        <div className={styles["stat-card"]}>
          <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--orders"]}`}>📋</div>
          <div className={styles["stat-card__body"]}>
            <div className={styles["stat-card__label"]}>Total Orders</div>
            <div className={styles["stat-card__value"]}>{stats.orders.value}</div>
            <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
              ↑ {stats.orders.change} this month
            </div>
          </div>
        </div>
        <div className={styles["stat-card"]}>
          <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--products"]}`}>📦</div>
          <div className={styles["stat-card__body"]}>
            <div className={styles["stat-card__label"]}>Active Products</div>
            <div className={styles["stat-card__value"]}>{stats.products.value}</div>
            <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
              ↑ {stats.products.change} new this week
            </div>
          </div>
        </div>
        <div className={styles["stat-card"]}>
          <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--customers"]}`}>👥</div>
          <div className={styles["stat-card__body"]}>
            <div className={styles["stat-card__label"]}>Customers</div>
            <div className={styles["stat-card__value"]}>{stats.customers.value}</div>
            <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
              ↑ {stats.customers.change} this month
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles["chart-grid"]}>
        <div className={styles["chart-card"]}>
          <div className={styles["chart-card__title"]}>Revenue Overview (Last 12 Months)</div>
          <div className={styles["chart-placeholder"]}>
            {chartBars.map((h, i) => (
              <div key={i} className={styles["chart-bar"]} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className={styles["chart-card"]}>
          <div className={styles["chart-card__title"]}>Sales by Category</div>
          <div className={styles["chart-donut-placeholder"]}>
            <div className={styles["chart-donut"]} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginTop: "var(--space-3)", justifyContent: "center" }}>
            {[
              { label: "Audio", color: "var(--color-signal-amber)" },
              { label: "Smart Home", color: "var(--color-trace-blue)" },
              { label: "Wearables", color: "var(--color-circuit-green)" },
              { label: "Accessories", color: "rgba(155,89,182,0.7)" },
            ].map((cat) => (
              <span key={cat.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: cat.color }} />
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={styles["admin-panel"]}>
        <div className={styles["admin-panel__header"]}>
          <div className={styles["admin-panel__title"]}>Recent Orders</div>
          <button className="btn btn--secondary btn--sm">View All →</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={styles["data-table"]}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className={styles["data-table__mono"]}><span className={styles["data-table__link"]}>{order.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{order.customer}</div>
                    <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{order.phone}</div>
                  </td>
                  <td>{order.items} item{order.items !== 1 ? "s" : ""}</td>
                  <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(order.total)}</td>
                  <td><span className={`${styles["status-dot"]} ${styles[`status-dot--${order.status}`]}`}>{order.status}</span></td>
                  <td className={styles["data-table__mono"]}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Products View ──────────────────────────────────────────
function ProductsView() {
  return (
    <div className={styles["admin-panel"]}>
      <div className={styles["admin-panel__header"]}>
        <div className={styles["admin-panel__title"]}>All Products ({productList.length})</div>
        <div className={styles["admin-panel__actions"]}>
          <button className="btn btn--secondary btn--sm">Export</button>
          <button className="btn btn--primary btn--sm">+ Add Product</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product.sku}>
                <td>
                  <div className={styles["data-table__product"]}>
                    <div className={styles["data-table__product-img"]}>📦</div>
                    <div className={styles["data-table__product-info"]}>
                      <div className={styles["data-table__product-name"]}>{product.name}</div>
                    </div>
                  </div>
                </td>
                <td><span className={styles["data-table__mono"]} style={{ fontSize: "var(--text-xs)" }}>{product.sku}</span></td>
                <td>{product.brand}</td>
                <td className={styles["data-table__mono"]} style={{ fontWeight: 600 }}>{formatBDT(product.price)}</td>
                <td className={styles["data-table__mono"]}>{product.stock}</td>
                <td><span className={`${styles["status-dot"]} ${styles[`status-dot--${product.status}`]}`}>{product.status === "low-stock" ? "Low Stock" : product.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <button className="btn btn--secondary btn--sm">Edit</button>
                    <button className="btn btn--secondary btn--sm" style={{ color: "var(--color-status-cancelled)" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Orders View ────────────────────────────────────────────
function OrdersView() {
  return (
    <div className={styles["admin-panel"]}>
      <div className={styles["admin-panel__header"]}>
        <div className={styles["admin-panel__title"]}>All Orders</div>
        <div className={styles["admin-panel__actions"]}>
          <select className="btn btn--secondary btn--sm" style={{ fontFamily: "var(--font-body)", cursor: "pointer" }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button className="btn btn--secondary btn--sm">Export</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className={styles["data-table__mono"]}><span className={styles["data-table__link"]}>{order.id}</span></td>
                <td>
                  <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{order.customer}</div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{order.phone}</div>
                </td>
                <td>{order.items}</td>
                <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(order.total)}</td>
                <td><span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)" }}>COD</span></td>
                <td><span className={`${styles["status-dot"]} ${styles[`status-dot--${order.status}`]}`}>{order.status}</span></td>
                <td className={styles["data-table__mono"]}>{order.date}</td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <button className="btn btn--secondary btn--sm">View</button>
                    <button className="btn btn--secondary btn--sm">Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Customers View ─────────────────────────────────────────
function CustomersView() {
  return (
    <div className={styles["admin-panel"]}>
      <div className={styles["admin-panel__header"]}>
        <div className={styles["admin-panel__title"]}>All Customers ({customerList.length})</div>
        <div className={styles["admin-panel__actions"]}>
          <button className="btn btn--secondary btn--sm">Export</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((customer) => (
              <tr key={customer.phone}>
                <td>
                  <div className={styles["data-table__product"]}>
                    <div className={styles["data-table__product-img"]} style={{
                      background: "linear-gradient(135deg, var(--color-signal-amber), #FF9A5C)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "var(--text-xs)",
                      fontFamily: "var(--font-display)",
                    }}>
                      {customer.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{customer.name}</div>
                  </div>
                </td>
                <td className={styles["data-table__mono"]}>{customer.phone}</td>
                <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{customer.email}</td>
                <td className={styles["data-table__mono"]}>{customer.orders}</td>
                <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(customer.spent)}</td>
                <td className={styles["data-table__mono"]}>{customer.joined}</td>
                <td>
                  <button className="btn btn--secondary btn--sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  const viewTitles: Record<AdminView, string> = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    customers: "Customers",
  };

  return (
    <div className={styles["admin-layout"]}>
      {/* ── Sidebar ── */}
      <aside className={styles["admin-sidebar"]}>
        <div className={styles["admin-sidebar__header"]}>
          <div className={styles["admin-sidebar__logo-icon"]}>I</div>
          <div className={styles["admin-sidebar__logo-text"]}>
            Inno<span>verse</span>
          </div>
          <span className={styles["admin-sidebar__badge"]}>Admin</span>
        </div>

        <nav className={styles["admin-nav"]}>
          {/* Main Nav */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>Main</div>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`${styles["admin-nav__link"]} ${activeView === item.key ? styles["admin-nav__link--active"] : ""}`}
                onClick={() => setActiveView(item.key)}
              >
                <span className={styles["admin-nav__icon"]}>{item.icon}</span>
                {item.label}
                {item.count && <span className={styles["admin-nav__count"]}>{item.count}</span>}
              </button>
            ))}
          </div>

          {/* Catalog */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>Catalog</div>
            {navUtility.map((item) => (
              <button key={item.label} className={styles["admin-nav__link"]}>
                <span className={styles["admin-nav__icon"]}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>System</div>
            <button className={styles["admin-nav__link"]}>
              <span className={styles["admin-nav__icon"]}>⚙️</span>
              Settings
            </button>
            <Link href="/" className={styles["admin-nav__link"]}>
              <span className={styles["admin-nav__icon"]}>🏪</span>
              View Store
            </Link>
          </div>
        </nav>

        <div className={styles["admin-sidebar__footer"]}>
          <div className={styles["admin-sidebar__user"]}>
            <div className={styles["admin-sidebar__user-avatar"]}>AD</div>
            <div className={styles["admin-sidebar__user-info"]}>
              <div className={styles["admin-sidebar__user-name"]}>Admin</div>
              <div className={styles["admin-sidebar__user-role"]}>Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={styles["admin-main"]}>
        {/* Top Bar */}
        <div className={styles["admin-topbar"]}>
          <div className={styles["admin-topbar__title"]}>{viewTitles[activeView]}</div>
          <div className={styles["admin-topbar__actions"]}>
            <div className={styles["admin-topbar__search"]}>
              🔍
              <input type="text" placeholder="Search..." id="admin-search" />
            </div>
            <button className={styles["admin-topbar__icon-btn"]} aria-label="Notifications">
              🔔
              <span className={styles["admin-topbar__notif-dot"]} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles["admin-content"]}>
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "products" && <ProductsView />}
          {activeView === "orders" && <OrdersView />}
          {activeView === "customers" && <CustomersView />}
        </div>
      </main>
    </div>
  );
}
