import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

export const categoryRoutes = Router();

// ── List Categories ─────────────────────────────────────────
// GET /api/categories
categoryRoutes.get("/", async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      image: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          _count: { select: { products: true } },
        },
      },
      _count: { select: { products: true } },
    },
  });

  return res.json({ categories });
});

// ── Single Category with Products ───────────────────────────
// GET /api/categories/:slug
categoryRoutes.get("/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      children: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true, icon: true },
      },
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  return res.json({ category });
});
