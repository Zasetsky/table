import cors from "cors";
import type { Request, Response, NextFunction } from "express";

const allowList = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const corsMw = cors({
  origin(origin, cb) {
    if (!origin || allowList.length === 0) return cb(null, true);
    cb(null, allowList.includes(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Ручной префлайт (OPTIONS)
export function preflightMw(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "OPTIONS") return next();

  const origin = req.headers.origin as string | undefined;
  const allowed =
    !origin || allowList.length === 0 || allowList.includes(origin);

  if (!allowed) return res.sendStatus(403);

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.status(204).end();
}
