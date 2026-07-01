import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Prisma errors
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as any;
    if (prismaErr.code === "P2002") {
      return res.status(409).json({
        error: `Duplicate value for: ${prismaErr.meta?.target?.join(", ")}`,
      });
    }
    if (prismaErr.code === "P2025") {
      return res.status(404).json({ error: "Record not found." });
    }
  }

  // Zod validation errors
  if (err.constructor.name === "ZodError") {
    const zodErr = err as any;
    return res.status(400).json({
      error: "Validation failed",
      details: zodErr.issues.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: "Internal server error",
  });
}
