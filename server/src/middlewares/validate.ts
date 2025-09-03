import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateQuery =
  <T>(schema: ZodType<T, any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next(parsed.error);
    res.locals.query = parsed.data as T;
    next();
  };

export const validateBody =
  <T>(schema: ZodType<T, any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next(parsed.error);
    res.locals.body = parsed.data as T;
    next();
  };
