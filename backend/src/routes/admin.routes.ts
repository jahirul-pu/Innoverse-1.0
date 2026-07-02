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
  sku: z.string().trim().optional().transform(v => v === "" ? undefined : v),
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
      sku: (data.sku || null) as any,
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
  const updateData = { ...req.body };
  
  if (updateData.sku !== undefined) {
    const trimmed = typeof updateData.sku === "string" ? updateData.sku.trim() : "";
    updateData.sku = trimmed === "" ? null : trimmed;
  }

  // Handle nested images update
  let newImages = undefined;
  if (updateData.images !== undefined) {
    newImages = updateData.images;
    delete updateData.images;
  }

  // Handle nested variants update
  let newVariants = undefined;
  if (updateData.variants !== undefined) {
    newVariants = updateData.variants;
    delete updateData.variants;
  }

  // Handle nested specs update
  let newSpecs = undefined;
  if (updateData.specs !== undefined) {
    newSpecs = updateData.specs;
    delete updateData.specs;
  }

  const product = await prisma.$transaction(async (tx) => {
    if (newImages !== undefined) {
      // Clear existing images
      await tx.productImage.deleteMany({
        where: { productId: id }
      });
      // Re-create new images
      if (Array.isArray(newImages) && newImages.length > 0) {
        await tx.productImage.createMany({
          data: newImages.map((img: any, i: number) => ({
            productId: id,
            url: img.url,
            alt: img.alt || null,
            isPrimary: img.isPrimary || i === 0,
            sortOrder: i
          }))
        });
      }
    }

    if (newVariants !== undefined) {
      // Clear existing variants
      await tx.productVariant.deleteMany({
        where: { productId: id }
      });
      // Re-create new variants
      if (Array.isArray(newVariants) && newVariants.length > 0) {
        await tx.productVariant.createMany({
          data: newVariants.map((v: any) => ({
            productId: id,
            name: v.name,
            type: v.type,
            value: v.value,
            priceAdj: v.priceAdj || 0,
            stock: v.stock || 0,
            sku: v.sku || null,
            isActive: v.isActive !== undefined ? v.isActive : true
          }))
        });
      }
    }

    if (newSpecs !== undefined) {
      // Clear existing specs
      await tx.productSpec.deleteMany({
        where: { productId: id }
      });
      // Re-create new specs
      if (Array.isArray(newSpecs) && newSpecs.length > 0) {
        await tx.productSpec.createMany({
          data: newSpecs.map((s: any, i: number) => ({
            productId: id,
            key: s.key,
            value: s.value,
            sortOrder: i
          }))
        });
      }
    }

    return await tx.product.update({
      where: { id },
      data: updateData,
      include: { images: true, specs: true, variants: true }
    });
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
// Category Management
// ─────────────────────────────────────────────────────────────

// GET /api/admin/categories — all categories including inactive, with product counts
adminRoutes.get("/categories", async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
      parent: { select: { id: true, name: true } },
    },
  });
  return res.json({ categories });
});

// POST /api/admin/categories
adminRoutes.post("/categories", async (req: Request, res: Response) => {
  const { name, description, icon, image, parentId } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const category = await prisma.category.create({
    data: { name, slug, description, icon, image, parentId },
  });

  return res.status(201).json({ category });
});

// PATCH /api/admin/categories/:id
adminRoutes.patch("/categories/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, icon, image, parentId, isActive, sortOrder } = req.body;

  const data: any = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) data.description = description;
  if (icon !== undefined) data.icon = icon;
  if (image !== undefined) data.image = image;
  if (parentId !== undefined) data.parentId = parentId || null;
  if (isActive !== undefined) data.isActive = isActive;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;

  const category = await prisma.category.update({ where: { id }, data });
  return res.json({ category });
});

// DELETE /api/admin/categories/:id (soft delete)
adminRoutes.delete("/categories/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.category.update({ where: { id }, data: { isActive: false } });
  return res.json({ message: "Category deactivated" });
});

// ─────────────────────────────────────────────────────────────
// Brand Management
// ─────────────────────────────────────────────────────────────

// GET /api/admin/brands — all brands including inactive, with product counts
adminRoutes.get("/brands", async (_req: Request, res: Response) => {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });
  return res.json({ brands });
});

// POST /api/admin/brands
adminRoutes.post("/brands", async (req: Request, res: Response) => {
  const { name, logo } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const brand = await prisma.brand.create({
    data: { name, slug, logo },
  });

  return res.status(201).json({ brand });
});

// PATCH /api/admin/brands/:id
adminRoutes.patch("/brands/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, logo, isActive } = req.body;

  const data: any = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name, { lower: true, strict: true });
  }
  if (logo !== undefined) data.logo = logo;
  if (isActive !== undefined) data.isActive = isActive;

  const brand = await prisma.brand.update({ where: { id }, data });
  return res.json({ brand });
});

// DELETE /api/admin/brands/:id (soft delete)
adminRoutes.delete("/brands/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.brand.update({ where: { id }, data: { isActive: false } });
  return res.json({ message: "Brand deactivated" });
});

// ─────────────────────────────────────────────────────────────
// Coupon Management
// ─────────────────────────────────────────────────────────────

// GET /api/admin/coupons
adminRoutes.get("/coupons", async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.json({ coupons });
});

// POST /api/admin/coupons
adminRoutes.post("/coupons", async (req: Request, res: Response) => {
  const { code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, expiresAt } = req.body;

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || null,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return res.status(201).json({ coupon });
});

// PATCH /api/admin/coupons/:id
adminRoutes.patch("/coupons/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, isActive, expiresAt } = req.body;

  const data: any = {};
  if (code !== undefined) data.code = code.toUpperCase();
  if (discountType !== undefined) data.discountType = discountType;
  if (discountValue !== undefined) data.discountValue = discountValue;
  if (minOrderAmount !== undefined) data.minOrderAmount = minOrderAmount || null;
  if (maxDiscount !== undefined) data.maxDiscount = maxDiscount || null;
  if (usageLimit !== undefined) data.usageLimit = usageLimit || null;
  if (isActive !== undefined) data.isActive = isActive;
  if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

  const coupon = await prisma.coupon.update({ where: { id }, data });
  return res.json({ coupon });
});

// DELETE /api/admin/coupons/:id (soft delete)
adminRoutes.delete("/coupons/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.coupon.update({ where: { id }, data: { isActive: false } });
  return res.json({ message: "Coupon deactivated" });
});
