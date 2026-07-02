"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { productApi } from "@/lib/api";
import styles from "./Admin.module.css";

type AdminView = "dashboard" | "products" | "orders" | "customers";

const navItems = [
  { icon: "📊", label: "Dashboard", key: "dashboard" as const },
  { icon: "📦", label: "Products", key: "products" as const },
  { icon: "🛒", label: "Orders", key: "orders" as const },
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

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  // Live Data States
  const [stats, setStats] = useState<any>({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Field states
  const [prodName, setProdName] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodComparePrice, setProdComparePrice] = useState("");
  const [prodCostPrice, setProdCostPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [prodBrandId, setProdBrandId] = useState("");
  const [prodShortDesc, setProdShortDesc] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsNewArrival, setProdIsNewArrival] = useState(false);

  // Auth check bypassed for development
  const isAdmin = true;

  // Fetch admin dashboard details
  async function loadAdminData() {
    if (!isAdmin) return;
    try {
      setLoading(true);
      setError(null);

      // 1. Load dashboard stats
      const statsRes = await fetch("http://localhost:4000/api/admin/stats", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }).then(r => r.json());

      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
        setRecentOrders(statsRes.recentOrders || []);
        setLowStockProducts(statsRes.lowStockProducts || []);
      }

      // 2. Load all categories & brands
      const catRes = await fetch("http://localhost:4000/api/categories").then(r => r.json());
      if (catRes && catRes.categories) setCategories(catRes.categories);

      const brandRes = await fetch("http://localhost:4000/api/products/brands").then(r => r.json());
      if (brandRes && brandRes.brands) setBrands(brandRes.brands);

      // 3. Load live products list
      const prodRes = await productApi.list({ limit: 100 });
      if (prodRes && prodRes.products) setProducts(prodRes.products);

      // 4. Load live orders list
      const ordersRes = await fetch("http://localhost:4000/api/admin/orders", {
        credentials: "include"
      }).then(r => r.json());
      if (ordersRes && ordersRes.orders) setOrders(ordersRes.orders);

      // 5. Load customers list (from users or custom stats)
      const customersRes = await fetch("http://localhost:4000/api/admin/orders", { credentials: "include" }).then(r => r.json());
      if (customersRes && customersRes.orders) {
        // Extract unique customers from orders as simple stub lists
        const customerMap: Record<string, any> = {};
        customersRes.orders.forEach((o: any) => {
          if (o.user && o.user.phone) {
            customerMap[o.user.phone] = {
              name: o.user.name || "Customer",
              phone: o.user.phone,
              email: o.user.email || "—",
              orders: (customerMap[o.user.phone]?.orders || 0) + 1,
              spent: (customerMap[o.user.phone]?.spent || 0) + Number(o.total),
              joined: new Date(o.user.createdAt || Date.now()).toLocaleDateString()
            };
          }
        });
        setCustomers(Object.values(customerMap));
      }

    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch administrative data. Ensure the database & backend are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, [user]);

  // Open modal for Create
  function openAddModal() {
    setEditingProduct(null);
    setProdName("");
    setProdSku("");
    setProdPrice("");
    setProdComparePrice("");
    setProdCostPrice("");
    setProdStock("");
    setProdCategoryId(categories[0]?.id || "");
    setProdBrandId(brands[0]?.id || "");
    setProdShortDesc("");
    setProdDesc("");
    setProdIsFeatured(false);
    setProdIsNewArrival(false);
    setProductModalOpen(true);
  }

  // Open modal for Edit
  function openEditModal(prod: any) {
    setEditingProduct(prod);
    setProdName(prod.name || "");
    setProdSku(prod.sku || "");
    setProdPrice(prod.price?.toString() || "");
    setProdComparePrice(prod.compareAtPrice?.toString() || "");
    setProdCostPrice(prod.costPrice?.toString() || "");
    setProdStock(prod.stock?.toString() || "");
    setProdCategoryId(prod.category?.id || prod.categoryId || "");
    setProdBrandId(prod.brand?.id || prod.brandId || "");
    setProdShortDesc(prod.shortDescription || "");
    setProdDesc(prod.description || "");
    setProdIsFeatured(prod.isFeatured || false);
    setProdIsNewArrival(prod.isNewArrival || false);
    setProductModalOpen(true);
  }

  // Handle Save (Create / Update)
  async function handleProductSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: prodName,
        sku: prodSku,
        price: Number(prodPrice),
        compareAtPrice: prodComparePrice ? Number(prodComparePrice) : undefined,
        costPrice: prodCostPrice ? Number(prodCostPrice) : undefined,
        stock: Number(prodStock),
        categoryId: prodCategoryId || categories[0]?.id,
        brandId: prodBrandId || brands[0]?.id,
        shortDescription: prodShortDesc,
        description: prodDesc,
        isFeatured: prodIsFeatured,
        isNewArrival: prodIsNewArrival
      };

      if (editingProduct) {
        // Edit flow
        const res = await fetch(`http://localhost:4000/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());

        if (res.error) throw new Error(res.error);
        alert("Product updated successfully!");
      } else {
        // Create flow
        const res = await fetch("http://localhost:4000/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());

        if (res.error) throw new Error(res.error);
        alert("Product created successfully!");
      }

      setProductModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message || err}`);
    }
  }

  // Handle Product Deactivate (Delete)
  async function handleProductDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this product? It will no longer show on the storefront.")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include"
      }).then(r => r.json());

      if (res.error) throw new Error(res.error);
      alert("Product deactivated successfully!");
      loadAdminData();
    } catch (err: any) {
      alert(`Error deleting product: ${err.message || err}`);
    }
  }

  // Handle Order Status Update
  async function handleOrderStatusUpdate(id: string, newStatus: string) {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include"
      }).then(r => r.json());

      if (res.error) throw new Error(res.error);
      alert("Order status updated successfully!");
      loadAdminData();
    } catch (err: any) {
      alert(`Error updating order status: ${err.message || err}`);
    }
  }



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
              </button>
            ))}
          </div>

          {/* Catalog Utility Stubs */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>Catalog</div>
            {navUtility.map((item) => (
              <button key={item.label} className={styles["admin-nav__link"]} onClick={() => alert(`${item.label} management is currently stubbed.`)}>
                <span className={styles["admin-nav__icon"]}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* System */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>System</div>
            <button className={styles["admin-nav__link"]} onClick={() => alert("Settings is currently stubbed.")}>
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
            <div className={styles["admin-sidebar__user-avatar"]}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div className={styles["admin-sidebar__user-info"]}>
              <div className={styles["admin-sidebar__user-name"]}>{user?.name || "Admin"}</div>
              <div className={styles["admin-sidebar__user-role"]}>{user?.role || "ADMIN"}</div>
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
              <input type="text" placeholder="Search (stub)..." id="admin-search" />
            </div>
            <button className={styles["admin-topbar__icon-btn"]} aria-label="Notifications" onClick={() => alert("No notifications.")}>
              🔔
              {lowStockProducts.length > 0 && <span className={styles["admin-topbar__notif-dot"]} />}
            </button>
          </div>
        </div>

        {/* Dynamic Admin Content Views */}
        <div className={styles["admin-content"]}>
          {error && <div style={{ color: "var(--color-status-cancelled)", padding: "var(--space-4)", backgroundColor: "rgba(220,53,69,0.05)", border: "1px solid var(--color-status-cancelled)", borderRadius: "var(--border-radius-md)", marginBottom: "var(--space-4)" }}>{error}</div>}

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0", color: "var(--color-text-tertiary)", fontFamily: "var(--font-data)" }}>Loading panel data...</div>
          ) : (
            <>
              {/* Dashboard View */}
              {activeView === "dashboard" && (
                <>
                  {/* Stats Grid */}
                  <div className={styles["stats-grid"]}>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--revenue"]}`}>💰</div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Total Revenue</div>
                        <div className={styles["stat-card__value"]}>{formatBDT(stats.totalRevenue)}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ Live Sum
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--orders"]}`}>📋</div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Total Orders</div>
                        <div className={styles["stat-card__value"]}>{stats.totalOrders}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ Active counter
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--products"]}`}>📦</div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Active Products</div>
                        <div className={styles["stat-card__value"]}>{stats.totalProducts}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ In Catalog
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--customers"]}`}>👥</div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Customers</div>
                        <div className={styles["stat-card__value"]}>{stats.totalCustomers}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ Customer base
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Alerts */}
                  {lowStockProducts.length > 0 && (
                    <div className={styles["admin-panel"]} style={{ borderColor: "var(--color-signal-amber)" }}>
                      <div className={styles["admin-panel__header"]} style={{ borderBottomColor: "var(--color-signal-amber)" }}>
                        <div className={styles["admin-panel__title"]} style={{ color: "var(--color-signal-amber)" }}>⚠️ Low Stock Warnings</div>
                      </div>
                      <div style={{ padding: "var(--space-4)" }}>
                        <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", listStyle: "none" }}>
                          {lowStockProducts.map((p: any) => (
                            <li key={p.sku} style={{ fontSize: "var(--text-sm)", display: "flex", justifyContent: "space-between" }}>
                              <span>{p.name} (SKU: {p.sku})</span>
                              <span style={{ fontWeight: 600, color: "var(--color-status-cancelled)" }}>Only {p.stock} units left!</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Recent Orders */}
                  <div className={styles["admin-panel"]}>
                    <div className={styles["admin-panel__header"]}>
                      <div className={styles["admin-panel__title"]}>Recent Orders</div>
                      <button className="btn btn--secondary btn--sm" onClick={() => setActiveView("orders")}>View All Orders →</button>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className={styles["data-table"]}>
                        <thead>
                          <tr>
                            <th>Order No</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: "center", padding: "var(--space-4)" }}>No orders placed yet.</td></tr>
                          ) : (
                            recentOrders.map((order: any) => (
                              <tr key={order.orderNumber}>
                                <td className={styles["data-table__mono"]}><span className={styles["data-table__link"]}>{order.orderNumber}</span></td>
                                <td>
                                  <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{order.user?.name || "Customer"}</div>
                                  <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{order.user?.phone}</div>
                                </td>
                                <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(Number(order.total))}</td>
                                <td><span className={`${styles["status-dot"]} ${styles[`status-dot--${order.status.toLowerCase()}`]}`}>{order.status}</span></td>
                                <td className={styles["data-table__mono"]}>{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Products View */}
              {activeView === "products" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Products ({products.length})</div>
                    <div className={styles["admin-panel__actions"]}>
                      <button className="btn btn--primary btn--sm" onClick={openAddModal}>+ Add Product</button>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Brand</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr><td colSpan={7} style={{ textAlign: "center", padding: "var(--space-4)" }}>No products in database.</td></tr>
                        ) : (
                          products.map((product: any) => (
                            <tr key={product.id}>
                              <td>
                                <div className={styles["data-table__product"]}>
                                  <div className={styles["data-table__product-img"]}>📦</div>
                                  <div className={styles["data-table__product-info"]}>
                                    <div className={styles["data-table__product-name"]}>{product.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span className={styles["data-table__mono"]} style={{ fontSize: "var(--text-xs)" }}>{product.sku}</span></td>
                              <td>{product.brand?.name}</td>
                              <td>{product.category?.name || "—"}</td>
                              <td className={styles["data-table__mono"]} style={{ fontWeight: 600 }}>{formatBDT(Number(product.price))}</td>
                              <td className={styles["data-table__mono"]}>{product.stock}</td>
                              <td>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <button className="btn btn--secondary btn--sm" onClick={() => openEditModal(product)}>Edit</button>
                                  <button className="btn btn--secondary btn--sm" style={{ color: "var(--color-status-cancelled)" }} onClick={() => handleProductDelete(product.id)}>Deactivate</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders View */}
              {activeView === "orders" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Orders ({orders.length})</div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Order No</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Method</th>
                          <th>Status</th>
                          <th>Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: "center", padding: "var(--space-4)" }}>No orders placed.</td></tr>
                        ) : (
                          orders.map((order: any) => (
                            <tr key={order.id}>
                              <td className={styles["data-table__mono"]}><span className={styles["data-table__link"]}>{order.orderNumber}</span></td>
                              <td>
                                <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{order.user?.name || "Customer"}</div>
                                <div style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{order.user?.phone}</div>
                              </td>
                              <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(Number(order.total))}</td>
                              <td><span style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-xs)" }}>{order.paymentMethod}</span></td>
                              <td><span className={`${styles["status-dot"]} ${styles[`status-dot--${order.status.toLowerCase()}`]}`}>{order.status}</span></td>
                              <td>
                                <select
                                  value={order.status}
                                  className={styles["data-table__mono"]}
                                  style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)", cursor: "pointer", border: "var(--border-hairline)", borderRadius: "var(--border-radius-sm)", backgroundColor: "var(--color-surface)" }}
                                  onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                >
                                  {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Customers View */}
              {activeView === "customers" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Customers ({customers.length})</div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Orders Placed</th>
                          <th>Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign: "center", padding: "var(--space-4)" }}>No registered customers with order history.</td></tr>
                        ) : (
                          customers.map((cust: any) => (
                            <tr key={cust.phone}>
                              <td>
                                <div className={styles["data-table__product"]}>
                                  <div className={styles["data-table__product-img"]} style={{ background: "linear-gradient(135deg, var(--color-signal-amber), #FF9A5C)", color: "#fff", fontWeight: 700, fontSize: "var(--text-xs)" }}>
                                    {cust.name.split(" ").map((n: string) => n[0]).join("")}
                                  </div>
                                  <div style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{cust.name}</div>
                                </div>
                              </td>
                              <td className={styles["data-table__mono"]}>{cust.phone}</td>
                              <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{cust.email}</td>
                              <td className={styles["data-table__mono"]}>{cust.orders}</td>
                              <td className={styles["data-table__mono"]} style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(cust.spent)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Add / Edit Product Modal ── */}
      {productModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setProductModalOpen(false)} style={{ zIndex: 999 }} />
          <div className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingProduct ? "Edit Product Settings" : "Create New Product Catalog"}
              </h3>
              <button className={styles.modal__close} onClick={() => setProductModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleProductSave}>
              <div className={styles.modal__body}>
                <div className={styles["form-grid"]}>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Product Name</label>
                    <input type="text" className="input" required value={prodName} onChange={(e) => setProdName(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">SKU (Stock Keeping Unit)</label>
                    <input type="text" className="input" required value={prodSku} onChange={(e) => setProdSku(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Stock Quantity</label>
                    <input type="number" className="input" required min="0" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Retail Price (৳)</label>
                    <input type="number" className="input" required min="1" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Compare Price (৳, optional)</label>
                    <input type="number" className="input" min="0" value={prodComparePrice} onChange={(e) => setProdComparePrice(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Cost Price (৳, optional)</label>
                    <input type="number" className="input" min="0" value={prodCostPrice} onChange={(e) => setProdCostPrice(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Category</label>
                    <select className="select" value={prodCategoryId} onChange={(e) => setProdCategoryId(e.target.value)}>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Brand Partner</label>
                    <select className="select" value={prodBrandId} onChange={(e) => setProdBrandId(e.target.value)}>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Short Description</label>
                    <input type="text" className="input" value={prodShortDesc} onChange={(e) => setProdShortDesc(e.target.value)} />
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Full HTML Description</label>
                    <textarea className="input" style={{ height: 80, resize: "vertical" }} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />
                  </div>
                  <div className={styles["form-checkbox-group"]}>
                    <input type="checkbox" id="featured" className={styles["form-checkbox"]} checked={prodIsFeatured} onChange={(e) => setProdIsFeatured(e.target.checked)} />
                    <label htmlFor="featured">Featured Product</label>
                  </div>
                  <div className={styles["form-checkbox-group"]}>
                    <input type="checkbox" id="new-arrival" className={styles["form-checkbox"]} checked={prodIsNewArrival} onChange={(e) => setProdIsNewArrival(e.target.checked)} />
                    <label htmlFor="new-arrival">New Arrival Tag</label>
                  </div>
                </div>
              </div>
              <div className={styles.modal__footer}>
                <button type="button" className="btn btn--secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Product</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
