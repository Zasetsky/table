import type { Request, Response } from "express";
import { ItemsService } from "../services/items.service.js";
import { z } from "zod";
import { listQueryDto, selectDto, reorderDto } from "../schemas/items.dto.js";

const svc = new ItemsService();

type ListQuery = z.infer<typeof listQueryDto>;
type SelectBody = z.infer<typeof selectDto>;
type ReorderBody = z.infer<typeof reorderDto>;

export const list = (req: Request, res: Response) => {
  const { q, offset, limit } = res.locals.query as ListQuery;
  const page = svc.list(req, q, offset, limit);
  res.json({ ...page, q });
};

export const select = (req: Request, res: Response) => {
  const { ids, selected } = res.locals.body as SelectBody;
  svc.select(req, ids, selected);
  res.json({ ok: true, selectedCount: svc.countSelected(req) });
};

export const reorder = (req: Request, res: Response) => {
  const parse = reorderDto.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ ok: false, error: parse.error.flatten() });
    return;
  }
  const { movedId, afterId } = parse.data as ReorderBody;
  svc.reorder(req, movedId, afterId);
  res.json({ ok: true });
};

export const selectedCount = (req: Request, res: Response) => {
  res.json({ selectedCount: svc.countSelected(req) });
};

export const getSavedQuery = (req: Request, res: Response) => {
  res.json({ q: svc.getSavedQuery(req) });
};
