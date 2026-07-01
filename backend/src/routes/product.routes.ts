import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { optionalAuth } from "../middleware/auth";
import { Prisma } from "@prisma/client";

export const productRoutes = Router();

// ── List Products ───────────────────────────────────────────
// GET /api/products
productRoutes.get("/", async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "16",
    category,
    brand,
    search,
    sort = "newest",
    minPrice,
    maxPrice,
    inStock,
    featured,
    newArrival,
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (brand) {
    where.brand = { slug: { in: brand.split(",") } };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (inStock === "true") {
    where.stock = { gt: 0 };
  } else if (inStock === "false") {
    where.stock = { lte: 0 };
  }

  if (featured === "true") where.isFeatured = true;
  if (newArrival === "true") where.isNewArrival = true;

  // Sort
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (sort) {
    case "price-low":
      orderBy = { price: "asc" };
      break;
    case "price-high":
      orderBy = { price: "desc" };
      break;
    case "name-az":
      orderBy = { name: "asc" };
      break;
    case "name-za":
      orderBy = { name: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        stock: true,
        isFeatured: true,
        isNewArrival: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true, slug: true } },
        images: {
          where: { isPrimary: true },
          select: { url: true, alt: true },
          take: 1,
        },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return res.json({
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// ── Search Suggestions ──────────────────────────────────────
// GET /api/products/search/suggestions?q=term
// NOTE: This must come BEFORE the /:slug route to avoid conflict
productRoutes.get("/search/suggestions", async (req: Request, res: Response) => {
  const q = (req.query.q as string) || "";
  if (q.length < 2) {
    return res.json({ suggestions: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 5,
    select: {
      name: true,
      slug: true,
      brand: { select: { name: true } },
    },
  });

  return res.json({ suggestions: products });
});

// ── Get Single Product ──────────────────────────────────────
// GET /api/products/:slug
productRoutes.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true, logo: true } },
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true } },
        },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Calculate average rating
  const avgRating = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  // Rating distribution
  const ratingDist = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId: product.id },
    _count: true,
  });

  // Related products (same category, different product)
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      brand: { select: { name: true } },
      images: {
        where: { isPrimary: true },
        select: { url: true, alt: true },
        take: 1,
      },
    },
  });

  // Check wishlist status
  let isWishlisted = false;
  if (req.user) {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: product.id,
        },
      },
    });
    isWishlisted = !!wishlistItem;
  }

  return res.json({
    product: {
      ...product,
      avgRating: avgRating._avg.rating || 0,
      reviewCount: avgRating._count.rating,
      ratingDistribution: ratingDist,
      isWishlisted,
    },
    related,
  });
});
