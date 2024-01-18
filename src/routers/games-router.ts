import { Router } from "express";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema-middleware";
import { gameInputSchema } from "@/schemas/games-schema";
import { gamesController } from "@/controllers/games-controller";

const gamesRouter: Router = Router();

gamesRouter.post("/", validateSchemaMiddleware(gameInputSchema), gamesController.createNew);
gamesRouter.get("/", gamesController.listAll);
gamesRouter.get("/:id", gamesController.listOne);
// gamesRouter.get("/:id/finish", gamesController.listOne);

export default gamesRouter;