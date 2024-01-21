import express, { json, Request, Response } from "express";
import "express-async-errors";
import httpStatus from "http-status";
import errorHandlingMiddleware from "./middlewares/errorHandler-middleware";
import router from "./routers/index-router";

const app = express();

app.use(json()); // body-parser


app.get('/health', (request: Request, response: Response) => {
  return response.status(httpStatus.OK).send("I'm ok!");
});

app.use(router);
app.use(errorHandlingMiddleware);

export default app;