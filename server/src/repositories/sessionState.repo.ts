import type { Request } from "express";
import type { SessionState } from "../types/session.js";

export class SessionStateRepo {
  private ensure(req: Request): SessionState {
    if (!req.session.state) {
      req.session.state = {
        selected: {},
        totalCache: {},
        lastQuery: "",
        prev: {},
        next: {},
      };
    }
    return req.session.state!;
  }

  getState(req: Request) {
    return this.ensure(req);
  }

  // Selected
  getSelected(req: Request) {
    return Object.keys(this.ensure(req).selected).map(Number);
  }
  setSelected(req: Request, ids: number[], on: boolean) {
    const st = this.ensure(req);
    for (const id of ids) {
      if (id < 1 || id > 1_000_000) continue;
      if (on) st.selected[id] = true;
      else delete st.selected[id];
    }
  }

  // Cache + last query
  getTotalCache(req: Request, q: string) {
    return this.ensure(req).totalCache[q];
  }
  setTotalCache(req: Request, q: string, total: number) {
    this.ensure(req).totalCache[q] = total;
  }
  getLastQuery(req: Request) {
    return this.ensure(req).lastQuery ?? "";
  }
  setLastQuery(req: Request, q: string) {
    this.ensure(req).lastQuery = q ?? "";
  }

  // Overlay links
  getPrevMap(req: Request) {
    return this.ensure(req).prev;
  }
  getNextMap(req: Request) {
    return this.ensure(req).next;
  }

  detach(req: Request, id: number) {
    const st = this.ensure(req);
    const p = st.prev[id];
    const n = st.next[id];
    if (p !== undefined && st.next[p] === id) delete st.next[p];
    if (n !== undefined && st.prev[n] === id) st.prev[n] = p;
    delete st.prev[id];
    if (n !== undefined) st.next[id] = n; // аккуратнее: не оставляем висячие, но и не портим цепь
    delete st.next[id];
  }

  placeAfter(req: Request, id: number, afterId: number | null) {
    // Снять с текущего места
    this.detach(req, id);
    if (afterId == null) return;

    const st = this.ensure(req);
    // Запрет циклов: если afterId находится в «хвосте» id — сперва отсечём id
    let cur = afterId;
    while (cur !== undefined) {
      if (cur === id) {
        this.detach(req, id);
        return;
      }
      cur = st.next[cur];
    }
    const oldNext = st.next[afterId];
    st.next[afterId] = id;
    st.prev[id] = afterId;
    if (oldNext !== undefined) {
      st.next[id] = oldNext;
      st.prev[oldNext] = id;
    }
  }
}
