import { Router } from "express";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema-middleware";
import { betInputSchema } from "@/schemas/bets-schema";
import { betsController } from "@/controllers/bets-controller";

const betsRouter: Router = Router();

betsRouter.post("/", validateSchemaMiddleware(betInputSchema), betsController.createNew);

export default betsRouter;