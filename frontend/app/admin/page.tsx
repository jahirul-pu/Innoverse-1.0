"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastContext";
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
  DollarSign,
  Headphones,
  Home,
  Watch,
  Plug,
  Camera,
  FolderOpen,
  PlugZap,
  Printer,
  Tag,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const categoryIconMap: Record<string, any> = {
  audio: Headphones,
  "smart-home": Home,
  wearables: Watch,
  accessories: Plug,
  cameras: Camera,
  adapter: PlugZap,
};

function renderCategoryIcon(slug: string, className?: string) {
  const IconComponent = categoryIconMap[slug] || FolderOpen;
  return <IconComponent size={20} className={className} />;
}

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
  const { toast } = useToast();

  const alert = (msg: any) => {
    const str = String(msg);
    const lower = str.toLowerCase();
    if (lower.includes("error") || lower.includes("fail") || lower.includes("invalid") || lower.includes("wrong")) {
      toast.error(str);
    } else if (lower.includes("success") || lower.includes("created") || lower.includes("updated") || lower.includes("deactivated")) {
      toast.success(str);
    } else {
      toast.info(str);
    }
  };

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

  // Order detail expansion state
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});

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
  const [prodWarranty, setProdWarranty] = useState("No Warranty");
  const [noWarranty, setNoWarranty] = useState(true);
  const [prodImages, setProdImages] = useState<{ url: string; alt?: string | null; isPrimary: boolean }[]>([]);
  const [prodVariants, setProdVariants] = useState<{ name: string; type: string; value: string; priceAdj: number; stock: number }[]>([]);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantType, setNewVariantType] = useState("color");
  const [newVariantValue, setNewVariantValue] = useState("");
  const [newVariantPriceAdj, setNewVariantPriceAdj] = useState("0");
  const [newVariantStock, setNewVariantStock] = useState("10");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");

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
      setError("Failed to fetch administrative data. Ensure the database & backend are running. Details: " + (err.message || err));
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
    setProdWarranty("No Warranty");
    setNoWarranty(true);
    setProdImages([]);
    setProdVariants([]);
    setNewVariantName("");
    setNewVariantType("color");
    setNewVariantValue("");
    setNewVariantPriceAdj("0");
    setNewVariantStock("10");
    setManualImageUrl("");
    setProductModalOpen(true);
  }

  // Open modal for Edit
  async function openEditModal(prod: any) {
    try {
      // Fetch fresh, full product details including variants
      const res = await productApi.getBySlug(prod.slug);
      const fullProd = res?.product || prod;

      setEditingProduct(fullProd);
      setProdName(fullProd.name || "");
      setProdSku(fullProd.sku || "");
      setProdPrice(fullProd.price?.toString() || "");
      setProdComparePrice(fullProd.compareAtPrice?.toString() || "");
      setProdCostPrice(fullProd.costPrice?.toString() || "");
      setProdStock(fullProd.stock?.toString() || "");
      setProdCategoryId(fullProd.category?.id || fullProd.categoryId || "");
      setProdBrandId(fullProd.brand?.id || fullProd.brandId || "");
      setProdShortDesc(fullProd.shortDescription || "");
      setProdDesc(fullProd.description || "");
      setProdWarranty(fullProd.warranty || "No Warranty");
      setNoWarranty(fullProd.warranty === "No Warranty" || !fullProd.warranty);
      setProdImages(
        fullProd.images?.map((img: any) => ({
          url: img.url,
          alt: img.alt || "",
          isPrimary: img.isPrimary || false,
        })) || []
      );
      setProdVariants(
        fullProd.variants?.map((v: any) => ({
          name: v.name,
          type: v.type,
          value: v.value,
          priceAdj: Number(v.priceAdj) || 0,
          stock: Number(v.stock) || 0,
        })) || []
      );
      setNewVariantName("");
      setNewVariantType("color");
      setNewVariantValue("");
      setNewVariantPriceAdj("0");
      setNewVariantStock("10");
      setManualImageUrl("");
      setProductModalOpen(true);
    } catch (err) {
      console.error("Failed to load product details from API", err);
      // Fallback
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
      setProdWarranty(prod.warranty || "No Warranty");
      setNoWarranty(prod.warranty === "No Warranty" || !prod.warranty);
      setProdImages(
        prod.images?.map((img: any) => ({
          url: img.url,
          alt: img.alt || "",
          isPrimary: img.isPrimary || false,
        })) || []
      );
      setProdVariants([]);
      setNewVariantName("");
      setNewVariantType("color");
      setNewVariantValue("");
      setNewVariantPriceAdj("0");
      setNewVariantStock("10");
      setManualImageUrl("");
      setProductModalOpen(true);
    }
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
        isNewArrival: prodIsNewArrival,
        warranty: noWarranty ? "No Warranty" : prodWarranty,
        images: prodImages,
        variants: prodVariants
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

  // Handle file uploads
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();
      
      // If uploading multiple, we can loop or use the multiple endpoint
      if (files.length === 1) {
        formData.append("image", files[0]);
        const res = await fetch("http://localhost:4000/api/upload/image", {
          method: "POST",
          body: formData,
          credentials: "include"
        }).then(r => r.json());

        if (res.error) throw new Error(res.error);
        if (res.url) {
          setProdImages((prev) => [
            ...prev,
            { url: res.url, isPrimary: prev.length === 0 }
          ]);
        }
      } else {
        // Multiple upload
        Array.from(files).forEach((file) => {
          formData.append("images", file);
        });
        const res = await fetch("http://localhost:4000/api/upload/images", {
          method: "POST",
          body: formData,
          credentials: "include"
        }).then(r => r.json());

        if (res.error) throw new Error(res.error);
        if (res.uploads) {
          const newImgs = res.uploads.map((up: any) => ({
            url: up.url,
            isPrimary: false
          }));
          setProdImages((prev) => {
            const updated = [...prev, ...newImgs];
            // ensure at least one primary
            if (updated.length > 0 && !updated.some(x => x.isPrimary)) {
              updated[0].isPrimary = true;
            }
            return updated;
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to upload image(s): " + (err.message || err));
    } finally {
      setUploadingImages(false);
      // Reset input value
      e.target.value = "";
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

  // Toggle order detail expansion
  async function toggleOrderDetails(order: any) {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(order.id);
    if (!orderDetails[order.id]) {
      try {
        const res = await fetch(`http://localhost:4000/api/orders/${order.orderNumber}`).then(r => r.json());
        if (res.order) {
          setOrderDetails(prev => ({ ...prev, [order.id]: res.order }));
        }
      } catch (err) {
        console.error("Failed to fetch order details", err);
      }
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
          <img src="/logo.jpg" alt="Innoverse Technology Logo" className={styles["admin-sidebar__logo-img"]} />
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
          {error && (
            <div style={{
              color: "var(--color-status-cancelled)",
              padding: "var(--space-4)",
              backgroundColor: "rgba(220,53,69,0.05)",
              border: "1px solid var(--color-status-cancelled)",
              borderRadius: "var(--border-radius-md)",
              marginBottom: "var(--space-4)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "var(--space-2)"
            }}>
              <span>{error}</span>
              <button
                onClick={() => loadAdminData()}
                style={{
                  backgroundColor: "var(--color-status-cancelled)",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap"
                }}
              >
                Retry
              </button>
            </div>
          )}

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
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--revenue"]}`}>
                        <DollarSign size={24} strokeWidth={2} />
                      </div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Total Revenue</div>
                        <div className={styles["stat-card__value"]}>{formatBDT(stats.totalRevenue)}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ Live Sum
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--orders"]}`}>
                        <ShoppingCart size={24} strokeWidth={2} />
                      </div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Total Orders</div>
                        <div className={styles["stat-card__value"]}>{stats.totalOrders}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ Active counter
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--products"]}`}>
                        <Package size={24} strokeWidth={2} />
                      </div>
                      <div className={styles["stat-card__body"]}>
                        <div className={styles["stat-card__label"]}>Active Products</div>
                        <div className={styles["stat-card__value"]}>{stats.totalProducts}</div>
                        <div className={`${styles["stat-card__change"]} ${styles["stat-card__change--up"]}`}>
                          ↑ In Catalog
                        </div>
                      </div>
                    </div>
                    <div className={styles["stat-card"]}>
                      <div className={`${styles["stat-card__icon"]} ${styles["stat-card__icon--customers"]}`}>
                        <Users size={24} strokeWidth={2} />
                      </div>
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
                          <th>Print</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length === 0 ? (
                          <tr><td colSpan={7} style={{ textAlign: "center", padding: "var(--space-4)" }}>No orders found.</td></tr>
                        ) : (
                          filteredOrders.map((order: any) => (
                            <>
                            <tr key={order.id} style={{ cursor: "pointer" }}>
                              <td className={styles["data-table__mono"]} onClick={() => toggleOrderDetails(order)}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                                  {expandedOrderId === order.id
                                    ? <ChevronDown size={14} style={{ color: "var(--color-signal-amber)" }} />
                                    : <ChevronRight size={14} style={{ color: "var(--color-text-tertiary)" }} />}
                                  <span className={styles["data-table__link"]}>{order.orderNumber}</span>
                                </span>
                              </td>
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
                              <td>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    title="Print Invoice"
                                    onClick={() => window.open(`/admin/invoice/${order.orderNumber}`, '_blank')}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "var(--space-1)",
                                      padding: "var(--space-1) var(--space-2)",
                                      fontSize: "var(--text-xs)",
                                      fontWeight: 600,
                                      color: "var(--color-signal-amber)",
                                      background: "rgba(255, 90, 31, 0.08)",
                                      border: "1px solid rgba(255, 90, 31, 0.2)",
                                      borderRadius: "var(--border-radius-sm)",
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                      fontFamily: "var(--font-data)",
                                      transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "rgba(255, 90, 31, 0.15)";
                                      e.currentTarget.style.borderColor = "rgba(255, 90, 31, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "rgba(255, 90, 31, 0.08)";
                                      e.currentTarget.style.borderColor = "rgba(255, 90, 31, 0.2)";
                                    }}
                                  >
                                    <Printer size={13} />
                                    Invoice
                                  </button>
                                  <button
                                    title="Print Shipping Sticker"
                                    onClick={() => window.open(`/admin/sticker/${order.orderNumber}`, '_blank')}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "var(--space-1)",
                                      padding: "var(--space-1) var(--space-2)",
                                      fontSize: "var(--text-xs)",
                                      fontWeight: 600,
                                      color: "var(--color-trace-blue)",
                                      background: "rgba(79, 70, 229, 0.08)",
                                      border: "1px solid rgba(79, 70, 229, 0.2)",
                                      borderRadius: "var(--border-radius-sm)",
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                      fontFamily: "var(--font-data)",
                                      transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "rgba(79, 70, 229, 0.15)";
                                      e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "rgba(79, 70, 229, 0.08)";
                                      e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.2)";
                                    }}
                                  >
                                    <Tag size={13} />
                                    Sticker
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {/* Expanded Order Details Row */}
                            {expandedOrderId === order.id && (
                              <tr key={`${order.id}-details`}>
                                <td colSpan={7} style={{ padding: 0, background: "var(--color-bg)" }}>
                                  <div style={{
                                    padding: "var(--space-3) var(--space-4)",
                                    borderTop: "2px solid var(--color-signal-amber)",
                                    borderBottom: "1px solid var(--color-border-light)",
                                  }}>
                                    {!orderDetails[order.id] ? (
                                      <div style={{ textAlign: "center", padding: "var(--space-3)", color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>Loading items...</div>
                                    ) : (
                                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
                                        <thead>
                                          <tr>
                                            <th style={{ textAlign: "left", padding: "6px 10px", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border-light)" }}>Product</th>
                                            <th style={{ textAlign: "center", padding: "6px 10px", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border-light)" }}>Qty</th>
                                            <th style={{ textAlign: "right", padding: "6px 10px", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border-light)" }}>Unit Price</th>
                                            <th style={{ textAlign: "right", padding: "6px 10px", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border-light)" }}>Total</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderDetails[order.id].items.map((item: any, idx: number) => (
                                            <tr key={item.id} style={{ background: idx % 2 === 0 ? "var(--color-surface)" : "transparent" }}>
                                              <td style={{ padding: "8px 10px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                                                <a
                                                  href={`/products/${item.product?.slug || ""}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  style={{ color: "var(--color-signal-amber)", textDecoration: "none", fontWeight: 600, borderBottom: "1px dashed rgba(255, 90, 31, 0.3)" }}
                                                  onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "var(--color-signal-amber)"; }}
                                                  onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255, 90, 31, 0.3)"; }}
                                                >
                                                  {item.productName}
                                                </a>
                                                {item.variantName && (
                                                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginLeft: 6 }}>({item.variantName})</span>
                                                )}
                                              </td>
                                              <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "var(--font-data)", color: "var(--color-text-secondary)" }}>{item.quantity}</td>
                                              <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "var(--font-data)", color: "var(--color-text-secondary)" }}>{formatBDT(Number(item.unitPrice))}</td>
                                              <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "var(--font-data)", fontWeight: 600, color: "var(--color-text-primary)" }}>{formatBDT(Number(item.total))}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            </>
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
                              <td>{renderCategoryIcon(cat.slug)}</td>
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
          <form onSubmit={handleProductSave} className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingProduct ? "Edit Product Settings" : "Create New Product Catalog"}
              </h3>
              <button className={styles.modal__close} onClick={() => setProductModalOpen(false)}>×</button>
            </div>
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
                    <label className="label">Warranty Period</label>
                    <select
                      className="select"
                      value={prodWarranty}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProdWarranty(val);
                        setNoWarranty(val === "No Warranty");
                      }}
                    >
                      <option value="No Warranty">No Warranty</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="12 Months">12 Months</option>
                      <option value="18 Months">18 Months</option>
                      <option value="24 Months">24 Months</option>
                      <option value="36 Months">36 Months</option>
                      <option value="48 Months">48 Months</option>
                      {/* Dynamic fallback for other custom values from database */}
                      {prodWarranty && ![
                        "No Warranty",
                        "3 Months",
                        "6 Months",
                        "12 Months",
                        "18 Months",
                        "24 Months",
                        "36 Months",
                        "48 Months"
                      ].includes(prodWarranty) && (
                        <option value={prodWarranty}>{prodWarranty}</option>
                      )}
                    </select>
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
                    <label className="label">Product Images</label>
                    <div className={styles["image-manager"]}>
                      {/* Image Dropzone / Selector */}
                      <label className={styles["upload-dropzone"]} style={{ border: "2px dashed var(--color-border)", borderRadius: "var(--border-radius-sm)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--space-4) var(--space-3)", cursor: "pointer" }}>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                        />
                        <div className={styles["upload-dropzone__icon"]} style={{ fontSize: "24px", color: "var(--color-text-tertiary)", marginBottom: "var(--space-2)" }}>
                          {uploadingImages ? "⏳" : "📤"}
                        </div>
                        <div className={styles["upload-dropzone__text"]} style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                          {uploadingImages ? "Uploading images to server..." : "Click to select or upload images"}
                        </div>
                      </label>

                      {/* Manual URL Input */}
                      <div className={styles["manual-url-row"]} style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Or paste external image URL directly..."
                          value={manualImageUrl}
                          onChange={(e) => setManualImageUrl(e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => {
                            if (manualImageUrl.trim()) {
                              setProdImages((prev) => [
                                ...prev,
                                {
                                  url: manualImageUrl.trim(),
                                  isPrimary: prev.length === 0,
                                },
                              ]);
                              setManualImageUrl("");
                            }
                          }}
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Images Preview Grid */}
                      {prodImages.length > 0 && (
                        <div className={styles["image-grid"]}>
                          {prodImages.map((img, i) => (
                            <div
                              key={i}
                              className={`${styles["image-card"]} ${img.isPrimary ? styles["image-card--primary"] : ""}`}
                              onClick={() => {
                                setProdImages((prev) =>
                                  prev.map((item, idx) => ({
                                    ...item,
                                    isPrimary: idx === i,
                                  }))
                                );
                              }}
                              title="Click to set as primary thumbnail"
                            >
                              <img src={img.url.startsWith("http") || img.url.startsWith("/") ? img.url : `http://localhost:4000${img.url}`} alt={img.alt || "Product image"} className={styles["image-card__img"]} />
                              {img.isPrimary && <span className={styles["image-card__badge"]}>Primary</span>}
                              <button
                                type="button"
                                className={styles["image-card__delete"]}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProdImages((prev) => {
                                    const next = prev.filter((_, idx) => idx !== i);
                                    // If we deleted the primary image, make the first one primary
                                    if (img.isPrimary && next.length > 0) {
                                      next[0].isPrimary = true;
                                    }
                                    return next;
                                  });
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

                  <div className={`${styles["form-group"]} ${styles["form-col-span-2"]}`} style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
                    <label className="label" style={{ fontWeight: "var(--weight-bold)", fontSize: "var(--text-base)" }}>Product Variants</label>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", display: "block", marginBottom: "var(--space-3)" }}>
                      Add options like colors (e.g. name: "Midnight Black", type: "color", value: "#1C1E20") or sizes.
                    </span>

                    {/* Variants List Table */}
                    {prodVariants.length > 0 && (
                      <table className={styles["specs-table"]} style={{ width: "100%", marginBottom: "var(--space-3)" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                            <th style={{ textAlign: "left", padding: "var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Name</th>
                            <th style={{ textAlign: "left", padding: "var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Type</th>
                            <th style={{ textAlign: "left", padding: "var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Value</th>
                            <th style={{ textAlign: "left", padding: "var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Price Adj (৳)</th>
                            <th style={{ textAlign: "left", padding: "var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Stock</th>
                            <th style={{ padding: "var(--space-2) 0", width: "40px" }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {prodVariants.map((v, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                              <td style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)" }}>{v.name}</td>
                              <td style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)", textTransform: "capitalize" }}>{v.type}</td>
                              <td style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  {v.type === "color" && (
                                    <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: v.value, border: "1px solid var(--color-border)" }} />
                                  )}
                                  <code>{v.value}</code>
                                </div>
                              </td>
                              <td style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)" }}>৳{v.priceAdj}</td>
                              <td style={{ padding: "var(--space-2) 0", fontSize: "var(--text-sm)" }}>{v.stock}</td>
                              <td style={{ padding: "var(--space-2) 0", textAlign: "right" }}>
                                <button
                                  type="button"
                                  onClick={() => setProdVariants(prev => prev.filter((_, i) => i !== idx))}
                                  style={{ background: "none", border: "none", color: "var(--color-signal-red)", fontSize: "16px", cursor: "pointer", padding: "0 4px" }}
                                  title="Remove variant"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Add Variant Form Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr 1fr auto", gap: "var(--space-2)", alignItems: "end", backgroundColor: "rgba(0, 0, 0, 0.02)", padding: "var(--space-3)", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border)" }}>
                      <div className={styles["form-group"]} style={{ margin: 0 }}>
                        <label className="label" style={{ fontSize: "var(--text-xxs)" }}>Variant Name</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Midnight Black"
                          value={newVariantName}
                          onChange={(e) => setNewVariantName(e.target.value)}
                        />
                      </div>
                      <div className={styles["form-group"]} style={{ margin: 0 }}>
                        <label className="label" style={{ fontSize: "var(--text-xxs)" }}>Type</label>
                        <select
                          className="select"
                          value={newVariantType}
                          onChange={(e) => {
                            setNewVariantType(e.target.value);
                            setNewVariantValue(e.target.value === "color" ? "#000000" : "");
                          }}
                        >
                          <option value="color">Color</option>
                          <option value="size">Size</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className={styles["form-group"]} style={{ margin: 0 }}>
                        <label className="label" style={{ fontSize: "var(--text-xxs)" }}>Value</label>
                        {newVariantType === "color" ? (
                          <div style={{ display: "flex", gap: "4px", width: "100%" }}>
                            <input
                              type="color"
                              className="input"
                              style={{ width: "32px", padding: 0, height: "36px", cursor: "pointer", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-xs)" }}
                              value={newVariantValue.startsWith("#") && newVariantValue.length === 7 ? newVariantValue : "#000000"}
                              onChange={(e) => setNewVariantValue(e.target.value)}
                            />
                            <input
                              type="text"
                              className="input"
                              style={{ flex: 1 }}
                              placeholder="#000000"
                              value={newVariantValue}
                              onChange={(e) => setNewVariantValue(e.target.value)}
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g. XL or 128GB"
                            value={newVariantValue}
                            onChange={(e) => setNewVariantValue(e.target.value)}
                          />
                        )}
                      </div>
                      <div className={styles["form-group"]} style={{ margin: 0 }}>
                        <label className="label" style={{ fontSize: "var(--text-xxs)" }}>Price Adj (৳)</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="0"
                          value={newVariantPriceAdj}
                          onChange={(e) => setNewVariantPriceAdj(e.target.value)}
                        />
                      </div>
                      <div className={styles["form-group"]} style={{ margin: 0 }}>
                        <label className="label" style={{ fontSize: "var(--text-xxs)" }}>Stock</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="10"
                          value={newVariantStock}
                          onChange={(e) => setNewVariantStock(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        style={{ height: "36px", padding: "0 var(--space-3)", whiteSpace: "nowrap" }}
                        onClick={() => {
                          if (!newVariantName.trim()) {
                            alert("Please enter a variant name");
                            return;
                          }
                          if (!newVariantValue.trim()) {
                            alert("Please enter a variant value");
                            return;
                          }
                          setProdVariants(prev => [
                            ...prev,
                            {
                              name: newVariantName.trim(),
                              type: newVariantType,
                              value: newVariantValue.trim(),
                              priceAdj: Number(newVariantPriceAdj) || 0,
                              stock: Number(newVariantStock) || 0,
                            }
                          ]);
                          setNewVariantName("");
                          setNewVariantValue(newVariantType === "color" ? "#000000" : "");
                          setNewVariantPriceAdj("0");
                          setNewVariantStock("10");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modal__footer}>
                <button type="button" className="btn btn--secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Save Product</button>
              </div>
          </form>
        </>
      )}
      {/* ── Add / Edit Category Modal ── */}
      {catModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setCatModalOpen(false)} style={{ zIndex: 999 }} />
          <form onSubmit={handleCatSave} className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingCat ? "Edit Category" : "Create New Category"}
              </h3>
              <button className={styles.modal__close} onClick={() => setCatModalOpen(false)}>×</button>
            </div>
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
        </>
      )}

      {/* ── Add / Edit Brand Modal ── */}
      {brandModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setBrandModalOpen(false)} style={{ zIndex: 999 }} />
          <form onSubmit={handleBrandSave} className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingBrand ? "Edit Brand" : "Create New Brand"}
              </h3>
              <button className={styles.modal__close} onClick={() => setBrandModalOpen(false)}>×</button>
            </div>
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
        </>
      )}

      {/* ── Add / Edit Coupon Modal ── */}
      {couponModalOpen && (
        <>
          <div className="overlay overlay--visible" onClick={() => setCouponModalOpen(false)} style={{ zIndex: 999 }} />
          <form onSubmit={handleCouponSave} className={styles.modal}>
            <div className={styles.modal__header}>
              <h3 className={styles.modal__title}>
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button className={styles.modal__close} onClick={() => setCouponModalOpen(false)}>×</button>
            </div>
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
        </>
      )}
    </div>
  );
}

