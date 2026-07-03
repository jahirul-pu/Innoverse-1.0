// ─────────────────────────────────────────────────────────────
// Innoverse Technologies — Frontend API Client
// Centralized fetch wrapper for all backend endpoints
// ─────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      data?.error || `Request failed (${res.status})`,
      res.status,
      data?.details
    );
  }

  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
  sendOtp: (phone: string, name?: string, email?: string) =>
    request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone, name, email }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),

  getMe: () => request("/auth/me"),

  updateProfile: (data: { name?: string; email?: string }) =>
    request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  logout: () => request("/auth/logout", { method: "POST" }),
};

// ─── Products ────────────────────────────────────────────────
export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  hasDiscount?: boolean;
}

export const productApi = {
  list: (filters: ProductFilters = {}) =>
    request("/products", {
      params: filters as Record<string, string | number | boolean | undefined>,
    }),

  getBySlug: (slug: string) => request(`/products/${slug}`),

  searchSuggestions: (q: string) =>
    request("/products/search/suggestions", { params: { q } }),
};

// ─── Categories ──────────────────────────────────────────────
export const categoryApi = {
  list: () => request("/categories"),
  getBySlug: (slug: string) => request(`/categories/${slug}`),
};

// ─── Cart ────────────────────────────────────────────────────
export const cartApi = {
  get: () => request("/cart"),

  addItem: (productId: string, quantity = 1, variantId?: string) =>
    request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, variantId }),
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    request(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    request(`/cart/items/${itemId}`, { method: "DELETE" }),

  clear: () => request("/cart", { method: "DELETE" }),
};

// ─── Orders ──────────────────────────────────────────────────
export interface CreateOrderData {
  addressId: string;
  paymentMethod: "COD" | "BANGLAQR" | "BKASH" | "NAGAD";
  deliveryZone: "dhaka" | "outside";
  notes?: string;
  couponCode?: string;
}

export const orderApi = {
  create: (data: CreateOrderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (page = 1, limit = 10) =>
    request("/orders", { params: { page, limit } }),

  getByOrderNumber: (orderNumber: string) =>
    request(`/orders/${orderNumber}`),

  cancel: (orderNumber: string) =>
    request(`/orders/${orderNumber}/cancel`, { method: "POST" }),

  validateCoupon: (code: string, subtotal: number) =>
    request("/orders/validate-coupon", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminApi = {
  getStats: () => request("/admin/stats"),

  // Products
  createProduct: (data: any) =>
    request("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: any) =>
    request(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    request(`/admin/products/${id}`, { method: "DELETE" }),

  // Orders
  listOrders: (page = 1, limit = 20, status?: string) =>
    request("/admin/orders", { params: { page, limit, status } }),

  updateOrderStatus: (
    id: string,
    status: string,
    trackingNumber?: string,
    courierPartner?: string
  ) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, trackingNumber, courierPartner }),
    }),

  // Categories & Brands
  createCategory: (data: { name: string; description?: string; icon?: string; parentId?: string }) =>
    request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createBrand: (data: { name: string; logo?: string }) =>
    request("/admin/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Upload ──────────────────────────────────────────────────
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE}/upload/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
      // No Content-Type header — browser sets it with boundary
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new ApiError(data?.error || "Upload failed", res.status);
    }
    return res.json();
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    const res = await fetch(`${API_BASE}/upload/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new ApiError(data?.error || "Upload failed", res.status);
    }
    return res.json();
  },
};

export { ApiError };
export default request;
