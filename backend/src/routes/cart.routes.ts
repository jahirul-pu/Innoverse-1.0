import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

export const cartRoutes = Router();

// All cart routes require authentication
cartRoutes.use(requireAuth);

// ── Get Cart ────────────────────────────────────────────────
// GET /api/cart
cartRoutes.get("/", async (req: Request, res: Response) => {
  let cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              images: {
                where: { isPrimary: true },
                select: { url: true, alt: true },
                take: 1,
              },
              brand: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                compareAtPrice: true,
                stock: true,
                images: {
                  where: { isPrimary: true },
                  select: { url: true, alt: true },
                  take: 1,
                },
                brand: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }

  return res.json({ cart });
});

// ── Add to Cart ─────────────────────────────────────────────
// POST /api/cart/items
const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).default(1),
  variantId: z.string().optional(),
});

cartRoutes.post("/items", async (req: Request, res: Response) => {
  const { productId, quantity, variantId } = addItemSchema.parse(req.body);

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user!.id },
    });
  }

  // Check product exists and has stock
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: { stock: true },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  // Upsert cart item
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        variantId,
      },
    });
  }

  return res.json({ message: "Added to cart" });
});

// ── Update Quantity ──────────────────────────────────────────
// PATCH /api/cart/items/:itemId
const updateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

cartRoutes.patch("/items/:itemId", async (req: Request, res: Response) => {
  const { quantity } = updateItemSchema.parse(req.body);
  const itemId = req.params.itemId as string;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: { select: { stock: true } } },
  });

  if (!item || item.cart.userId !== req.user!.id) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  if (item.product.stock < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return res.json({ message: "Quantity updated" });
});

// ── Remove Item ─────────────────────────────────────────────
// DELETE /api/cart/items/:itemId
cartRoutes.delete("/items/:itemId", async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== req.user!.id) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return res.json({ message: "Item removed" });
});

// ── Clear Cart ──────────────────────────────────────────────
// DELETE /api/cart
cartRoutes.delete("/", async (req: Request, res: Response) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  return res.json({ message: "Cart cleared" });
});
