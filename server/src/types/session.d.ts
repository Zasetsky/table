import "express-session";

export type SessionState = {
  selected: Record<number, true>;
  orderByQuery: Record<string, number[]>;
  totalCache: Record<string, number>;
  lastQuery: string;
};

declare module "express-session" {
  interface SessionData {
    state?: SessionState;
  }
}
