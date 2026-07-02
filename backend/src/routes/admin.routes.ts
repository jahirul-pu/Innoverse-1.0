import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { z } from "zod";
import slugify from "slugify";

export const adminRoutes = Router();

// All admin routes require auth + admin role (bypassed for development)
// adminRoutes.use(requireAuth);
// adminRoutes.use(requireAdmin);

// ─────────────────────────────────────────────────────────────
// Dashboard Stats
// ─────────────────────────────────────────────────────────────
// GET /api/admin/stats
adminRoutes.get("/stats", async (_req: Request, res: Response) => {
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        user: { select: { name: true, phone: true } },
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: 5 },
      },
      take: 10,
      select: {
        name: true,
        sku: true,
        stock: true,
        lowStockThreshold: true,
      },
    }),
  ]);

  return res.json({
    stats: {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: totalRevenue._sum.total || 0,
    },
    recentOrders,
    lowStockProducts,
  });
});

// ─────────────────────────────────────────────────────────────
// Product Management
// ─────────────────────────────────────────────────────────────
const createProductSchema = z.object({
  name: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string(),
  barcode: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().optional(),
  categoryId: z.string(),
  brandId: z.string(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  specs: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  variants: z.array(z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
    priceAdj: z.number().default(0),
    stock: z.number().int().default(0),
  })).optional(),
});

// POST /api/admin/products
adminRoutes.post("/products", async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const slug = slugify(data.name, { lower: true, strict: true });

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      costPrice: data.costPrice,
      sku: data.sku,
      barcode: data.barcode,
      stock: data.stock,
      lowStockThreshold: data.lowStockThreshold,
      weight: data.weight,
      categoryId: data.categoryId,
      brandId: data.brandId,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      images: data.images ? { create: data.images.map((img, i) => ({ ...img, sortOrder: i })) } : undefined,
      specs: data.specs ? { create: data.specs.map((s, i) => ({ ...s, sortOrder: i })) } : undefined,
      variants: data.variants ? { create: data.variants } : undefined,
    },
    include: { images: true, specs: true, variants: true },
  });

  return res.status(201).json({ product });
});

// PATCH /api/admin/products/:id
adminRoutes.patch("/products/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });

  return res.json({ product });
});

// DELETE /api/admin/products/:id
adminRoutes.delete("/products/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return res.json({ message: "Product deactivated" });
});

// ─────────────────────────────────────────────────────────────
// Order Management
// ─────────────────────────────────────────────────────────────
// GET /api/admin/orders
adminRoutes.get("/orders", async (req: Request, res: Response) => {
  const { page = "1", limit = "20", status } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, parseInt(limit));

  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, phone: true } },
        address: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return res.json({
    orders,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
});

// PATCH /api/admin/orders/:id/status
const updateStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]),
  trackingNumber: z.string().optional(),
  courierPartner: z.string().optional(),
  description: z.string().optional(),
});

adminRoutes.patch("/orders/:id/status", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, trackingNumber, courierPartner, description } = updateStatusSchema.parse(req.body);

  const statusTitles: Record<string, string> = {
    CONFIRMED: "Order Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const order = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: {
        status: status as any,
        trackingNumber,
        courierPartner,
        ...(status === "DELIVERED" ? { paymentStatus: "PAID" as const } : {}),
      },
    });

    await tx.orderTimeline.create({
      data: {
        orderId: updated.id,
        status,
        title: statusTitles[status] || status,
        description: description || `Order status updated to ${status}.`,
      },
    });

    return updated;
  });

  return res.json({ order });
});

// ─────────────────────────────────────────────────────────────
// Category & Brand Management
// ─────────────────────────────────────────────────────────────
adminRoutes.post("/categories", async (req: Request, res: Response) => {
  const { name, description, icon, image, parentId } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const category = await prisma.category.create({
    data: { name, slug, description, icon, image, parentId },
  });

  return res.status(201).json({ category });
});

adminRoutes.post("/brands", async (req: Request, res: Response) => {
  const { name, logo } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const brand = await prisma.brand.create({
    data: { name, slug, logo },
  });

  return res.status(201).json({ brand });
});
