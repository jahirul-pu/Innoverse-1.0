"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { productApi } from "@/lib/api";
import styles from "./Admin.module.css";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Building2, 
  Ticket, 
  Image as ImageIcon, 
  Bell, 
  Sun, 
  Moon, 
  Search,
  Plus,
  Trash2,
  Edit,
  Store,
  Settings,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from "lucide-react";

type AdminView = "dashboard" | "products" | "orders" | "customers" | "categories" | "brands" | "coupons";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" as const },
  { icon: Package, label: "Products", key: "products" as const },
  { icon: ShoppingCart, label: "Orders", key: "orders" as const },
  { icon: Users, label: "Customers", key: "customers" as const },
];

const navCatalog = [
  { icon: FolderTree, label: "Categories", key: "categories" as const },
  { icon: Building2, label: "Brands", key: "brands" as const },
  { icon: Ticket, label: "Coupons", key: "coupons" as const },
];

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [activeView]);

  // Live Data States
  const [stats, setStats] = useState<any>({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("");

  // Brand modal state
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");

  // Coupon modal state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("PERCENTAGE");
  const [couponValue, setCouponValue] = useState("");
  const [couponMinOrder, setCouponMinOrder] = useState("");
  const [couponMaxDiscount, setCouponMaxDiscount] = useState("");
  const [couponUsageLimit, setCouponUsageLimit] = useState("");
  const [couponExpiry, setCouponExpiry] = useState("");

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

  // Dark mode theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
      if (current) {
        setTheme(current);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("admin-theme", nextTheme);
  };

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

      // 2. Load all categories & brands (from admin endpoints which include inactive + counts)
      const catRes = await fetch("http://localhost:4000/api/admin/categories").then(r => r.json());
      if (catRes && catRes.categories) setCategories(catRes.categories);

      const brandRes = await fetch("http://localhost:4000/api/admin/brands").then(r => r.json());
      if (brandRes && brandRes.brands) setBrands(brandRes.brands);

      // 2b. Load coupons
      const couponRes = await fetch("http://localhost:4000/api/admin/coupons").then(r => r.json());
      if (couponRes && couponRes.coupons) setCoupons(couponRes.coupons);

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

  // Category Modal Handlers
  function openAddCatModal() {
    setEditingCat(null);
    setCatName("");
    setCatDesc("");
    setCatIcon("");
    setCatModalOpen(true);
  }

  function openEditCatModal(cat: any) {
    setEditingCat(cat);
    setCatName(cat.name || "");
    setCatDesc(cat.description || "");
    setCatIcon(cat.icon || "");
    setCatModalOpen(true);
  }

  async function handleCatSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: catName,
        description: catDesc,
        icon: catIcon,
      };
      let res;
      if (editingCat) {
        res = await fetch(`http://localhost:4000/api/admin/categories/${editingCat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      } else {
        res = await fetch(`http://localhost:4000/api/admin/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      }
      if (res.error) throw new Error(res.error);
      alert(editingCat ? "Category updated successfully!" : "Category created successfully!");
      setCatModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(`Error saving category: ${err.message || err}`);
    }
  }

  async function handleCatDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this category?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include"
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      alert("Category deactivated successfully!");
      loadAdminData();
    } catch (err: any) {
      alert(`Error deleting category: ${err.message || err}`);
    }
  }

  // Brand Modal Handlers
  function openAddBrandModal() {
    setEditingBrand(null);
    setBrandName("");
    setBrandLogo("");
    setBrandModalOpen(true);
  }

  function openEditBrandModal(brand: any) {
    setEditingBrand(brand);
    setBrandName(brand.name || "");
    setBrandLogo(brand.logo || "");
    setBrandModalOpen(true);
  }

  async function handleBrandSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        name: brandName,
        logo: brandLogo,
      };
      let res;
      if (editingBrand) {
        res = await fetch(`http://localhost:4000/api/admin/brands/${editingBrand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      } else {
        res = await fetch(`http://localhost:4000/api/admin/brands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      }
      if (res.error) throw new Error(res.error);
      alert(editingBrand ? "Brand updated successfully!" : "Brand created successfully!");
      setBrandModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(`Error saving brand: ${err.message || err}`);
    }
  }

  async function handleBrandDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this brand?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/brands/${id}`, {
        method: "DELETE",
        credentials: "include"
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      alert("Brand deactivated successfully!");
      loadAdminData();
    } catch (err: any) {
      alert(`Error deleting brand: ${err.message || err}`);
    }
  }

  // Coupon Modal Handlers
  function openAddCouponModal() {
    setEditingCoupon(null);
    setCouponCode("");
    setCouponType("PERCENTAGE");
    setCouponValue("");
    setCouponMinOrder("");
    setCouponMaxDiscount("");
    setCouponUsageLimit("");
    setCouponExpiry("");
    setCouponModalOpen(true);
  }

  function openEditCouponModal(coupon: any) {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code || "");
    setCouponType(coupon.discountType || "PERCENTAGE");
    setCouponValue(coupon.discountValue?.toString() || "");
    setCouponMinOrder(coupon.minOrderAmount?.toString() || "");
    setCouponMaxDiscount(coupon.maxDiscount?.toString() || "");
    setCouponUsageLimit(coupon.usageLimit?.toString() || "");
    setCouponExpiry(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "");
    setCouponModalOpen(true);
  }

  async function handleCouponSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        code: couponCode,
        discountType: couponType,
        discountValue: Number(couponValue),
        minOrderAmount: couponMinOrder ? Number(couponMinOrder) : null,
        maxDiscount: couponMaxDiscount ? Number(couponMaxDiscount) : null,
        usageLimit: couponUsageLimit ? Number(couponUsageLimit) : null,
        expiresAt: couponExpiry ? new Date(couponExpiry).toISOString() : null,
      };
      let res;
      if (editingCoupon) {
        res = await fetch(`http://localhost:4000/api/admin/coupons/${editingCoupon.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      } else {
        res = await fetch(`http://localhost:4000/api/admin/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include"
        }).then(r => r.json());
      }
      if (res.error) throw new Error(res.error);
      alert(editingCoupon ? "Coupon updated successfully!" : "Coupon created successfully!");
      setCouponModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(`Error saving coupon: ${err.message || err}`);
    }
  }

  async function handleCouponDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this coupon?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/coupons/${id}`, {
        method: "DELETE",
        credentials: "include"
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      alert("Coupon deactivated successfully!");
      loadAdminData();
    } catch (err: any) {
      alert(`Error deleting coupon: ${err.message || err}`);
    }
  }

  // Computed filtered lists based on search query
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBrands = brands.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewTitles: Record<AdminView, string> = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    customers: "Customers",
    categories: "Categories",
    brands: "Brands",
    coupons: "Coupons",
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
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  className={`${styles["admin-nav__link"]} ${activeView === item.key ? styles["admin-nav__link--active"] : ""}`}
                  onClick={() => setActiveView(item.key)}
                >
                  <IconComponent className={styles["admin-nav__icon"]} size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Catalog */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>Catalog</div>
            {navCatalog.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  className={`${styles["admin-nav__link"]} ${activeView === item.key ? styles["admin-nav__link--active"] : ""}`}
                  onClick={() => setActiveView(item.key)}
                >
                  <IconComponent className={styles["admin-nav__icon"]} size={18} />
                  {item.label}
                </button>
              );
            })}
            <button className={styles["admin-nav__link"]} onClick={() => alert("Media management coming soon.")}>
              <ImageIcon className={styles["admin-nav__icon"]} size={18} />
              Media
            </button>
          </div>

          {/* System */}
          <div className={styles["admin-nav__group"]}>
            <div className={styles["admin-nav__group-label"]}>System</div>
            <button className={styles["admin-nav__link"]} onClick={() => alert("Settings is currently stubbed.")}>
              <Settings className={styles["admin-nav__icon"]} size={18} />
              Settings
            </button>
            <Link href="/" className={styles["admin-nav__link"]}>
              <Store className={styles["admin-nav__icon"]} size={18} />
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
              <Search size={16} style={{ minWidth: 16 }} />
              <input
                type="text"
                placeholder={activeView === "dashboard" ? "Select a tab to search..." : `Search ${viewTitles[activeView]}...`}
                id="admin-search"
                disabled={activeView === "dashboard"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles["admin-topbar__icon-btn"]} aria-label="Notifications" onClick={() => alert("No notifications.")}>
              <Bell size={18} />
              {lowStockProducts.length > 0 && <span className={styles["admin-topbar__notif-dot"]} />}
            </button>
            <button className={styles["admin-topbar__icon-btn"]} aria-label="Toggle Theme" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
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
                    <div className={styles["admin-panel__title"]}>All Products ({filteredProducts.length})</div>
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
                        {filteredProducts.length === 0 ? (
                          <tr><td colSpan={7} style={{ textAlign: "center", padding: "var(--space-4)" }}>No products found.</td></tr>
                        ) : (
                          filteredProducts.map((product: any) => (
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
                    <div className={styles["admin-panel__title"]}>All Orders ({filteredOrders.length})</div>
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
                        {filteredOrders.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: "center", padding: "var(--space-4)" }}>No orders found.</td></tr>
                        ) : (
                          filteredOrders.map((order: any) => (
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
                    <div className={styles["admin-panel__title"]}>All Customers ({filteredCustomers.length})</div>
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
                        {filteredCustomers.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign: "center", padding: "var(--space-4)" }}>No customers found.</td></tr>
                        ) : (
                          filteredCustomers.map((cust: any) => (
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

              {/* Categories View */}
              {activeView === "categories" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Categories ({filteredCategories.length})</div>
                    <div className={styles["admin-panel__actions"]}>
                      <button className="btn btn--primary btn--sm" onClick={openAddCatModal}>+ Add Category</button>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Icon</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>Description</th>
                          <th>Products</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.length === 0 ? (
                          <tr><td colSpan={7} style={{ textAlign: "center", padding: "var(--space-4)" }}>No categories found.</td></tr>
                        ) : (
                          filteredCategories.map((cat: any) => (
                            <tr key={cat.id}>
                              <td style={{ fontSize: "var(--text-lg)" }}>{cat.icon || "📁"}</td>
                              <td style={{ fontWeight: 500 }}>{cat.name}</td>
                              <td className={styles["data-table__mono"]} style={{ fontSize: "var(--text-xs)" }}>{cat.slug}</td>
                              <td style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>{cat.description || "—"}</td>
                              <td className={styles["data-table__mono"]}>{cat._count?.products ?? 0}</td>
                              <td>
                                <span className={`${styles["status-dot"]} ${cat.isActive ? styles["status-dot--confirmed"] : styles["status-dot--cancelled"]}`}>
                                  {cat.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <button className="btn btn--secondary btn--sm" onClick={() => openEditCatModal(cat)}>Edit</button>
                                  {cat.isActive && (
                                    <button className="btn btn--secondary btn--sm" style={{ color: "var(--color-status-cancelled)" }} onClick={() => handleCatDelete(cat.id)}>Deactivate</button>
                                  )}
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

              {/* Brands View */}
              {activeView === "brands" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Brands ({filteredBrands.length})</div>
                    <div className={styles["admin-panel__actions"]}>
                      <button className="btn btn--primary btn--sm" onClick={openAddBrandModal}>+ Add Brand</button>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Logo</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>Products</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBrands.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: "center", padding: "var(--space-4)" }}>No brands found.</td></tr>
                        ) : (
                          filteredBrands.map((brand: any) => (
                            <tr key={brand.id}>
                              <td>{brand.logo ? <img src={brand.logo} alt={brand.name} style={{ height: 24, objectFit: "contain" }} /> : "—"}</td>
                              <td style={{ fontWeight: 500 }}>{brand.name}</td>
                              <td className={styles["data-table__mono"]} style={{ fontSize: "var(--text-xs)" }}>{brand.slug}</td>
                              <td className={styles["data-table__mono"]}>{brand._count?.products ?? 0}</td>
                              <td>
                                <span className={`${styles["status-dot"]} ${brand.isActive ? styles["status-dot--confirmed"] : styles["status-dot--cancelled"]}`}>
                                  {brand.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <button className="btn btn--secondary btn--sm" onClick={() => openEditBrandModal(brand)}>Edit</button>
                                  {brand.isActive && (
                                    <button className="btn btn--secondary btn--sm" style={{ color: "var(--color-status-cancelled)" }} onClick={() => handleBrandDelete(brand.id)}>Deactivate</button>
                                  )}
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

              {/* Coupons View */}
              {activeView === "coupons" && (
                <div className={styles["admin-panel"]}>
                  <div className={styles["admin-panel__header"]}>
                    <div className={styles["admin-panel__title"]}>All Coupons ({filteredCoupons.length})</div>
                    <div className={styles["admin-panel__actions"]}>
                      <button className="btn btn--primary btn--sm" onClick={openAddCouponModal}>+ Add Coupon</button>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles["data-table"]}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Type</th>
                          <th>Value</th>
                          <th>Min Order</th>
                          <th>Limit / Used</th>
                          <th>Status</th>
                          <th>Expires</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCoupons.length === 0 ? (
                          <tr><td colSpan={8} style={{ textAlign: "center", padding: "var(--space-4)" }}>No coupons found.</td></tr>
                        ) : (
                          filteredCoupons.map((coupon: any) => (
                            <tr key={coupon.id}>
                              <td className={styles["data-table__mono"]} style={{ fontWeight: 600 }}>{coupon.code}</td>
                              <td style={{ fontSize: "var(--text-sm)" }}>{coupon.discountType}</td>
                              <td className={styles["data-table__mono"]}>{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : formatBDT(Number(coupon.discountValue))}</td>
                              <td className={styles["data-table__mono"]}>{coupon.minOrderAmount ? formatBDT(Number(coupon.minOrderAmount)) : "—"}</td>
                              <td className={styles["data-table__mono"]}>{coupon.usageLimit ? `${coupon.usedCount} / ${coupon.usageLimit}` : `${coupon.usedCount} / ∞`}</td>
                              <td>
                                <span className={`${styles["status-dot"]} ${coupon.isActive ? styles["status-dot--confirmed"] : styles["status-dot--cancelled"]}`}>
                                  {coupon.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className={styles["data-table__mono"]} style={{ fontSize: "var(--text-xs)" }}>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
                              <td>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <button className="btn btn--secondary btn--sm" onClick={() => openEditCouponModal(coupon)}>Edit</button>
                                  {coupon.isActive && (
                                    <button className="btn btn--secondary btn--sm" style={{ color: "var(--color-status-cancelled)" }} onClick={() => handleCouponDelete(coupon.id)}>Deactivate</button>
                                  )}
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
                    <label className="label">SKU (Stock Keeping Unit, optional)</label>
                    <input type="text" className="input" value={prodSku} onChange={(e) => setProdSku(e.target.value)} />
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
      {/* ── Add / Edit Category Modal ── */}
      {catModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setCatModalOpen(false)} style={{ zIndex: 999 }} />
          <div className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingCat ? "Edit Category" : "Create New Category"}
              </h3>
              <button className={styles.modal__close} onClick={() => setCatModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCatSave}>
              <div className={styles.modal__body}>
                <div className={styles["form-grid"]}>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Category Name</label>
                    <input type="text" className="input" required value={catName} onChange={(e) => setCatName(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Icon (Emoji / text)</label>
                    <input type="text" className="input" value={catIcon} placeholder="e.g. 🎧" onChange={(e) => setCatIcon(e.target.value)} />
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Description</label>
                    <textarea className="input" style={{ height: 80, resize: "vertical" }} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className={styles.modal__footer}>
                <button type="button" className="btn btn--secondary" onClick={() => setCatModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Category</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Add / Edit Brand Modal ── */}
      {brandModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setBrandModalOpen(false)} style={{ zIndex: 999 }} />
          <div className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingBrand ? "Edit Brand" : "Create New Brand"}
              </h3>
              <button className={styles.modal__close} onClick={() => setBrandModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleBrandSave}>
              <div className={styles.modal__body}>
                <div className={styles["form-grid"]}>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Brand Name</label>
                    <input type="text" className="input" required value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                  </div>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Logo Image URL</label>
                    <input type="text" className="input" value={brandLogo} placeholder="e.g. /images/logo.png" onChange={(e) => setBrandLogo(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className={styles.modal__footer}>
                <button type="button" className="btn btn--secondary" onClick={() => setBrandModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Brand</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── Add / Edit Coupon Modal ── */}
      {couponModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setCouponModalOpen(false)} style={{ zIndex: 999 }} />
          <div className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button className={styles.modal__close} onClick={() => setCouponModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCouponSave}>
              <div className={styles.modal__body}>
                <div className={styles["form-grid"]}>
                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`}>
                    <label className="label">Coupon Code</label>
                    <input type="text" className="input" required style={{ textTransform: "uppercase" }} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Discount Type</label>
                    <select className="select" value={couponType} onChange={(e) => setCouponType(e.target.value)}>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Discount Value</label>
                    <input type="number" className="input" required min="1" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Min Order Amount (৳, optional)</label>
                    <input type="number" className="input" min="0" value={couponMinOrder} onChange={(e) => setCouponMinOrder(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Max Discount (৳, optional)</label>
                    <input type="number" className="input" min="0" value={couponMaxDiscount} onChange={(e) => setCouponMaxDiscount(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Usage Limit (optional)</label>
                    <input type="number" className="input" min="1" value={couponUsageLimit} onChange={(e) => setCouponUsageLimit(e.target.value)} />
                  </div>
                  <div className={styles["form-group"]}>
                    <label className="label">Expiry Date (optional)</label>
                    <input type="date" className="input" value={couponExpiry} onChange={(e) => setCouponExpiry(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className={styles.modal__footer}>
                <button type="button" className="btn btn--secondary" onClick={() => setCouponModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Coupon</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

