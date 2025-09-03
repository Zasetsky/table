import session from "express-session";
import createMemoryStore from "memorystore";

const Memorystore = createMemoryStore(session);
const isProd = process.env.NODE_ENV === "production";

export const sessionMw = session({
  secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  store: new Memorystore({ checkPeriod: 86400000 }), // очистка раз в сутки
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
  },
});
