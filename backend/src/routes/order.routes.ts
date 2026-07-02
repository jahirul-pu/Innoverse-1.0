import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

export const orderRoutes = Router();

// ── Generate Order Number ───────────────────────────────────
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${seq}`;
}

// ── Create Order (from cart) ────────────────────────────────
// POST /api/orders
const createOrderSchema = z.object({
  addressId: z.string().optional(),
  addressData: z.object({
    fullName: z.string(),
    phone: z.string(),
    district: z.string(),
    address: z.string(),
  }).optional(),
  paymentMethod: z.enum(["COD", "BANGLAQR", "BKASH", "NAGAD"]),
  deliveryZone: z.enum(["dhaka", "outside"]),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

orderRoutes.post("/", requireAuth, async (req: Request, res: Response) => {
  const { addressId, addressData, paymentMethod, deliveryZone, notes, couponCode } =
    createOrderSchema.parse(req.body);

  let addressIdToUse = addressId;

  if (addressData) {
    const newAddress = await prisma.address.create({
      data: {
        fullName: addressData.fullName,
        phone: addressData.phone,
        district: addressData.district,
        address: addressData.address,
        userId: req.user!.id,
      },
    });
    addressIdToUse = newAddress.id;
  } else if (addressIdToUse) {
    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressIdToUse, userId: req.user!.id },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
  } else {
    return res.status(400).json({ error: "Either addressId or addressData must be provided" });
  }

  // Get cart items
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${item.product.name}`,
      });
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = cart.items.map((item) => {
    const unitPrice = Number(item.product.price);
    const total = unitPrice * item.quantity;
    subtotal += total;

    // Find variant name if applicable
    let variantName: string | undefined;
    if (item.variantId) {
      const variant = item.product.variants.find((v) => v.id === item.variantId);
      variantName = variant?.name;
    }

    return {
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice,
      total,
      variantName,
    };
  });

  const shippingCost = deliveryZone === "dhaka" ? 60 : 120;
  let discount = 0;

  // Apply coupon if provided
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase(), isActive: true },
    });

    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (coupon.discountType === "PERCENTAGE") {
            discount = subtotal * (Number(coupon.discountValue) / 100);
            if (coupon.maxDiscount) {
              discount = Math.min(discount, Number(coupon.maxDiscount));
            }
          } else {
            discount = Number(coupon.discountValue);
          }

          // Increment usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }
  }

  const total = subtotal + shippingCost - discount;
  const orderNumber = generateOrderNumber();

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
        addressId: addressIdToUse!,
        paymentMethod: paymentMethod as any,
        deliveryZone,
        subtotal,
        shippingCost,
        discount,
        total,
        notes,
        estimatedDelivery: deliveryZone === "dhaka" ? "1-2 business days" : "3-5 business days",
        items: {
          create: orderItems,
        },
        timeline: {
          create: {
            status: "PENDING",
            title: "Order Placed",
            description: `Order ${orderNumber} has been placed successfully.`,
          },
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Decrease stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  return res.status(201).json({ order });
});

// ── List User Orders ────────────────────────────────────────
// GET /api/orders
orderRoutes.get("/", requireAuth, async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: req.user!.id },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where: { userId: req.user!.id } }),
  ]);

  return res.json({
    orders,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
});

// ── Get Order Details ───────────────────────────────────────
// GET /api/orders/:orderNumber
orderRoutes.get("/:orderNumber", async (req: Request, res: Response) => {
  const orderNumber = req.params.orderNumber as string;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            select: {
              slug: true,
              images: {
                where: { isPrimary: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      },
      address: true,
      timeline: { orderBy: { createdAt: "asc" } },
      user: { select: { name: true, phone: true } },
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.json({ order });
});

// ── Cancel Order ────────────────────────────────────────────
// POST /api/orders/:orderNumber/cancel
orderRoutes.post("/:orderNumber/cancel", requireAuth, async (req: Request, res: Response) => {
  const orderNumber = req.params.orderNumber as string;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || order.userId !== req.user!.id) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (!["PENDING", "CONFIRMED"].includes(order.status)) {
    return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });

    // Restore stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Add timeline entry
    await tx.orderTimeline.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
        title: "Order Cancelled",
        description: "Order was cancelled by the customer.",
      },
    });
  });

  return res.json({ message: "Order cancelled" });
});
