import express, { json, Request, Response } from "express";
import "express-async-errors";
import httpStatus from "http-status";
import participantsRouter from "./routers/participants-router";
import gamesRouter from "./routers/games-router";
import betsRouter from "./routers/bets-router";
import errorHandlingMiddleware from "./middlewares/errorHandler-middleware";

const app = express();

app.use(json()); // body-parser


app.get('/health', (request: Request, response: Response) => {
  return response.status(httpStatus.OK).send("I'm ok!");
});

app.use("/participants", participantsRouter);
app.use("/games", gamesRouter);
app.use("/bets", betsRouter);
app.use(errorHandlingMiddleware);

export default app;