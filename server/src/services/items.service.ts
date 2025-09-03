import type { Request } from "express";
import { ascendingIdsMatching, ONE_MILLION } from "../utils/search.js";
import type { Page } from "../utils/pagination.js";
import { SessionStateRepo } from "../repositories/sessionState.repo.js";

export class ItemsService {
  constructor(private repo = new SessionStateRepo()) {}

  private countTotal(req: Request, q: string): number {
    const cached = this.repo.getTotalCache(req, q);
    if (typeof cached === "number") return cached;
    let total = 0;
    if (!q.trim()) total = ONE_MILLION;
    else for (const _ of ascendingIdsMatching(q)) total++;
    this.repo.setTotalCache(req, q, total);
    return total;
  }

  getSavedQuery(req: Request) {
    return this.repo.getLastQuery(req);
  }

  list(
    req: Request,
    q: string,
    offset: number,
    limit: number
  ): Page<{ id: number; selected: boolean }> {
    this.repo.setLastQuery(req, q);

    const selectedSet = new Set(this.repo.getSelected(req));
    const head = this.repo.getHead(req, q);
    const headSet = new Set(head);

    const headFiltered: number[] = q.trim()
      ? head.filter((id) => id.toString().includes(q))
      : head.slice();

    const pageIds: number[] = [];
    let skipped = 0;
    for (const id of headFiltered) {
      if (skipped < offset) {
        skipped++;
        continue;
      }
      if (pageIds.length >= limit) break;
      pageIds.push(id);
    }
    if (pageIds.length < limit) {
      let localOffset = Math.max(0, offset - headFiltered.length);
      for (const id of ascendingIdsMatching(q)) {
        if (headSet.has(id)) continue;
        if (localOffset > 0) {
          localOffset--;
          continue;
        }
        pageIds.push(id);
        if (pageIds.length >= limit) break;
      }
    }

    const total = this.countTotal(req, q);
    return {
      items: pageIds.map((id) => ({ id, selected: selectedSet.has(id) })),
      total,
      offset,
      limit,
    };
  }

  select(req: Request, ids: number[], on: boolean) {
    this.repo.setSelected(req, ids, on);
  }

  reorder(req: Request, q: string, orderedIds: number[]) {
    this.repo.setLastQuery(req, q);

    const prev = this.repo.getHead(req, q);
    const seen = new Set<number>();
    const head: number[] = [];
    for (const id of orderedIds) {
      if (id < 1 || id > ONE_MILLION) continue;
      if (!seen.has(id)) {
        seen.add(id);
        head.push(id);
      }
    }
    for (const id of prev) if (!seen.has(id)) head.push(id);
    this.repo.setHead(req, q, head);
  }

  countSelected(req: Request) {
    return this.repo.getSelected(req).length;
  }
}
