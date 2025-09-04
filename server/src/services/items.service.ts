import type { Request } from "express";
import { ONE_MILLION } from "../utils/search.js";
import type { Page } from "../utils/pagination.js";
import { SessionStateRepo } from "../repositories/sessionState.repo.js";

export class ItemsService {
  constructor(private repo = new SessionStateRepo()) {}

  private countTotal(req: Request, q: string): number {
    const cached = this.repo.getTotalCache(req, q);
    if (typeof cached === "number") return cached;
    let total = 0;
    if (!q.trim()) total = ONE_MILLION;
    else {
      // Подсчёт по строковому вхождению без материализации
      for (let i = 1; i <= ONE_MILLION; i++) {
        if (i.toString().includes(q)) total++;
      }
    }
    this.repo.setTotalCache(req, q, total);
    return total;
  }

  getSavedQuery(req: Request) {
    return this.repo.getLastQuery(req);
  }

  // Итератор по глобальному эффективному порядку с учётом prev/next
  private *iterateGlobal(req: Request): Generator<number> {
    const prev = this.repo.getPrevMap(req);
    const next = this.repo.getNextMap(req);

    // Множество «перемещённых» — их не выводим в базовой позиции
    // (ключи prev — это все id, у которых есть новый якорь)
    const moved = prev;

    for (let base = 1; base <= ONE_MILLION; base++) {
      if (moved[base] !== undefined) {
        // base перемещён — пропускаем базовую позицию
      } else {
        // выводим базовый
        yield base;
        // затем «хвост» цепочки после base (если есть)
        let n = next[base];
        while (n !== undefined) {
          yield n;
          n = next[n];
        }
      }
    }
  }

  list(
    req: Request,
    q: string,
    offset: number,
    limit: number
  ): Page<{ id: number; selected: boolean }> {
    this.repo.setLastQuery(req, q);

    const selectedSet = new Set(this.repo.getSelected(req));
    const items: number[] = [];
    let skipped = 0;

    const query = q.trim();

    for (const id of this.iterateGlobal(req)) {
      if (query && !id.toString().includes(query)) continue;
      if (skipped < offset) {
        skipped++;
        continue;
      }
      items.push(id);
      if (items.length >= limit) break;
    }

    const total = this.countTotal(req, q);
    return {
      items: items.map((id) => ({ id, selected: selectedSet.has(id) })),
      total,
      offset,
      limit,
    };
  }

  select(req: Request, ids: number[], on: boolean) {
    this.repo.setSelected(req, ids, on);
  }

  // Новый упрощённый порядок: одно действие = «поставить X после Y»
  reorder(req: Request, movedId: number, afterId: number | null) {
    if (
      !Number.isInteger(movedId) ||
      movedId < 1 ||
      movedId > ONE_MILLION ||
      (afterId !== null &&
        (!Number.isInteger(afterId) || afterId < 1 || afterId > ONE_MILLION))
    ) {
      return;
    }
    if (afterId === movedId) return;
    this.repo.placeAfter(req, movedId, afterId);
  }

  countSelected(req: Request) {
    return this.repo.getSelected(req).length;
  }
}
