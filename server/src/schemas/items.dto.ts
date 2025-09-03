import { z } from "zod";

export const listQueryDto = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(200).default(20),
  q: z.string().max(50).default(""),
});

export const selectDto = z.object({
  ids: z.array(z.number().int().min(1).max(1_000_000)).min(1),
  selected: z.boolean(),
});

export const reorderDto = z.object({
  q: z.string().max(50).default(""),
  orderedIds: z.array(z.number().int().min(1).max(1_000_000)),
});
