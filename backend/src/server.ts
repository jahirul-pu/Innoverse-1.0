import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler";
import { productRoutes } from "./routes/product.routes";
import { authRoutes } from "./routes/auth.routes";
import { cartRoutes } from "./routes/cart.routes";
import { orderRoutes } from "./routes/order.routes";
import { categoryRoutes } from "./routes/category.routes";
import { uploadRoutes } from "./routes/upload.routes";
import { adminRoutes } from "./routes/admin.routes";

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Static files (uploads)
app.use("/uploads", express.static("uploads"));

// ── Routes ─────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// ── Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 Innoverse API running at http://localhost:${PORT}`);
  console.log(`  📡 Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
