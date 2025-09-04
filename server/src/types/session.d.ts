import "express-session";

export type SessionState = {
  selected: Record<number, true>;
  totalCache: Record<string, number>;
  lastQuery: string;
  prev: Record<number, number>;
  next: Record<number, number>;
};

declare module "express-session" {
  interface SessionData {
    state?: SessionState;
  }
}
