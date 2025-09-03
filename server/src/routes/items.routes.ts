import { Router } from "express";
import * as ctrl from "../controllers/items.controller.js";
import { validateQuery, validateBody } from "../middlewares/validate.js";
import { listQueryDto, selectDto, reorderDto } from "../schemas/items.dto.js";

export const itemsRouter = Router();

itemsRouter.get("/", validateQuery(listQueryDto), ctrl.list);
itemsRouter.post("/select", validateBody(selectDto), ctrl.select);
itemsRouter.post("/reorder", validateBody(reorderDto), ctrl.reorder);
itemsRouter.get("/selected/count", ctrl.selectedCount);
itemsRouter.get("/search/last", ctrl.getSavedQuery);
