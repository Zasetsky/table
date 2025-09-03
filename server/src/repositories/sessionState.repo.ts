import type { Request } from "express";
import type { SessionState } from "../types/session.js";

export class SessionStateRepo {
  private ensure(req: Request): SessionState {
    if (!req.session.state) {
      req.session.state = { selected: {}, orderByQuery: {}, totalCache: {} };
    }
    return req.session.state!;
  }

  getState(req: Request) {
    return this.ensure(req);
  }

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

  getHead(req: Request, q: string) {
    return this.ensure(req).orderByQuery[q] ?? [];
  }

  setHead(req: Request, q: string, head: number[]) {
    this.ensure(req).orderByQuery[q] = head;
  }

  getTotalCache(req: Request, q: string) {
    return this.ensure(req).totalCache[q];
  }

  setTotalCache(req: Request, q: string, total: number) {
    this.ensure(req).totalCache[q] = total;
  }
}
