import { Router } from "express";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema-middleware";
import { participantInputSchema } from "@/schemas/participants-schema";
import { participantsController } from "@/controllers/participants-controller";


const participantsRouter: Router = Router();

participantsRouter.post("/", validateSchemaMiddleware(participantInputSchema), participantsController.createNew);
participantsRouter.get("/", participantsController.listAll);

export default participantsRouter;