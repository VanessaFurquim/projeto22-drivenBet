import { Router } from "express";
import betsRouter from "./bets-router";
import gamesRouter from "./games-router";
import participantsRouter from "./participants-router";

const router = Router();

router.use("/participants", participantsRouter);
router.use("/games", gamesRouter);
router.use("/bets", betsRouter);

export default router;