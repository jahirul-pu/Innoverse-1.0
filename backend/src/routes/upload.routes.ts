import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { requireAuth, requireAdmin } from "../middleware/auth";

export const uploadRoutes = Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "uploads");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || "5") || 5) * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed"));
    }
  },
});

// ── Upload Single Image ─────────────────────────────────────
// POST /api/upload/image
uploadRoutes.post(
  "/image",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;
    return res.json({
      url,
      filename: req.file.filename,
      size: req.file.size,
    });
  }
);

// ── Upload Multiple Images ──────────────────────────────────
// POST /api/upload/images
uploadRoutes.post(
  "/images",
  upload.array("images", 10),
  (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploads = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
    }));

    return res.json({ uploads });
  }
);



const BANNERS_FILE = path.join(process.env.UPLOAD_DIR || "uploads", "banners.json");

const defaultBanners = [
  {
    id: "1",
    overline: "New Arrival",
    title: "Wireless ANC Earbuds Pro",
    description: "40dB active noise cancellation, 32-hour battery life, IPX5 water resistance. Your perfect everyday companion.",
    price: "৳2,990",
    originalPrice: "৳3,450",
    discount: "−13%",
    cta: "Shop Now",
    href: "/products/wireless-anc-earbuds-pro",
    imageUrl: "",
    gradient: "linear-gradient(135deg, #1a1c20 0%, #2a2d33 100%)"
  },
  {
    id: "2",
    overline: "Limited Deal",
    title: "Smart Home Starter Kit",
    description: "Everything you need to make your home smarter — hub, 3 smart plugs, and 2 LED bulbs included.",
    price: "৳5,490",
    originalPrice: "৳7,200",
    discount: "−24%",
    cta: "Grab the Deal",
    href: "/products/smart-home-starter-kit",
    imageUrl: "",
    gradient: "linear-gradient(135deg, #0f1923 0%, #1a2735 100%)"
  },
  {
    id: "3",
    overline: "Trending Now",
    title: "Ultra-Slim Power Bank 20000mAh",
    description: "Charge 3 devices simultaneously. USB-C PD 65W fast charging. Weighs just 340g.",
    price: "৳1,890",
    originalPrice: "৳2,200",
    discount: "−14%",
    cta: "Buy Now",
    href: "/products/ultra-slim-power-bank",
    imageUrl: "",
    gradient: "linear-gradient(135deg, #191b1f 0%, #252830 100%)"
  }
];

// GET /api/upload/banners
uploadRoutes.get("/banners", async (_req: Request, res: Response) => {
  try {
    try {
      const data = await fs.readFile(BANNERS_FILE, "utf-8");
      return res.json({ banners: JSON.parse(data) });
    } catch {
      return res.json({ banners: defaultBanners });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to load banners" });
  }
});

// POST /api/upload/banners
uploadRoutes.post("/banners", async (req: Request, res: Response) => {
  try {
    const { banners } = req.body;
    if (!Array.isArray(banners)) {
      return res.status(400).json({ error: "Banners must be an array" });
    }

    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(BANNERS_FILE, JSON.stringify(banners, null, 2), "utf-8");
    return res.json({ message: "Banners updated successfully", banners });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update banners" });
  }
});

const POPUPS_FILE = path.join(process.env.UPLOAD_DIR || "uploads", "popups.json");

const defaultPopups = [
  {
    id: "1",
    title: "Exclusive Welcome Coupon",
    imageUrl: "/uploads/placeholder-popup.jpg",
    href: "/coupons",
    isActive: true,
  }
];

// GET /api/upload/popups
uploadRoutes.get("/popups", async (_req: Request, res: Response) => {
  try {
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    try {
      await fs.access(POPUPS_FILE);
    } catch {
      await fs.writeFile(POPUPS_FILE, JSON.stringify(defaultPopups, null, 2), "utf-8");
    }

    const content = await fs.readFile(POPUPS_FILE, "utf-8");
    const popups = JSON.parse(content);
    return res.json({ popups });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to load popups" });
  }
});

// POST /api/upload/popups
uploadRoutes.post("/popups", async (req: Request, res: Response) => {
  try {
    const { popups } = req.body;
    if (!Array.isArray(popups)) {
      return res.status(400).json({ error: "Popups must be an array" });
    }

    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(POPUPS_FILE, JSON.stringify(popups, null, 2), "utf-8");
    return res.json({ message: "Popups updated successfully", popups });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update popups" });
  }
});


