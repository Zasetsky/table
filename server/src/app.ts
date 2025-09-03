import express from "express";
import { corsMw, preflightMw } from "./config/cors.js";
import { sessionMw } from "./config/session.js";
import { itemsRouter } from "./routes/items.routes.js";
import { errorHandler } from "./middlewares/error.js";

const isProd = process.env.NODE_ENV === "production";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  if (!isProd) {
    app.use(preflightMw);
    app.use(corsMw);
  }

  app.use(express.json());
  app.use(sessionMw);

  app.use("/api/items", itemsRouter);
  app.use(errorHandler);

  return app;
}
