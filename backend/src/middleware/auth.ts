import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "innoverse-dev-secret";

export interface AuthUser {
  id: string;
  phone: string;
  role: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Require authentication. Extracts JWT from Authorization header or cookie.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, phone: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or deactivated account" });
    }

    req.user = { id: user.id, phone: user.phone, role: user.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Require admin role.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN")) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

/**
 * Optional auth — attaches user if token is present, but doesn't block.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, phone: true, role: true },
      });
      if (user) {
        req.user = { id: user.id, phone: user.phone, role: user.role };
      }
    }
  } catch {
    // Silently continue
  }
  next();
}

/**
 * Generate JWT token for a user.
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}
