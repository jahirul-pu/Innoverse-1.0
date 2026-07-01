import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
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
  requireAuth,
  requireAdmin,
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
  requireAuth,
  requireAdmin,
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
