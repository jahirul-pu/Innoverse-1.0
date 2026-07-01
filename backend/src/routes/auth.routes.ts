import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { generateToken, requireAuth } from "../middleware/auth";
import { z } from "zod";

export const authRoutes = Router();

// ── Validation Schemas ─────────────────────────────────────
const sendOtpSchema = z.object({
  phone: z.string().regex(/^01\d{9}$/, "Invalid BD phone number (01XXXXXXXXX)"),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^01\d{9}$/),
  code: z.string().length(6, "OTP must be 6 digits"),
});

// ── Send OTP ────────────────────────────────────────────────
// POST /api/auth/send-otp
authRoutes.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { phone, name, email } = sendOtpSchema.parse(req.body);

    // Generate 6-digit OTP (stub — in production, send via SMS gateway)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, name, email },
      });
    }

    // Store OTP
    await prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: user.id,
      },
    });

    console.log(`\n🔑 [OTP Service] Generated verification code ${code} for user ${phone}\n`);

    // In production: send SMS via provider
    // For now: return code in dev mode
    const response: any = {
      message: "OTP sent successfully",
      expiresIn: 300, // seconds
    };

    if (process.env.NODE_ENV === "development") {
      response.devOtp = code; // Only in dev!
    }

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.issues,
      });
    }
    throw error;
  }
});

// ── Verify OTP ──────────────────────────────────────────────
// POST /api/auth/verify-otp
authRoutes.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { phone, code } = verifyOtpSchema.parse(req.body);

    // Find valid OTP
    const otp = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mark OTP as verified
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Get user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { id: true, phone: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate JWT
    const token = generateToken(user.id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Verified successfully",
      token,
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.issues,
      });
    }
    throw error;
  }
});

// ── Get Current User ────────────────────────────────────────
// GET /api/auth/me
authRoutes.get("/me", requireAuth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      phone: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      addresses: true,
      _count: {
        select: { orders: true, reviews: true, wishlist: true },
      },
    },
  });

  return res.json({ user });
});

// ── Update Profile ──────────────────────────────────────────
// PATCH /api/auth/profile
authRoutes.patch("/profile", requireAuth, async (req: Request, res: Response) => {
  const updateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  });

  const data = updateSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data,
    select: { id: true, phone: true, name: true, email: true },
  });

  return res.json({ user });
});

// ── Logout ──────────────────────────────────────────────────
// POST /api/auth/logout
authRoutes.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});
