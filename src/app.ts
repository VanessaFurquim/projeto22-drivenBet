import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';

const app = express();

app.use(json()); // body-parser

app.get('/health', (request: Request, response: Response) => {
  return response.status(httpStatus.OK).send("I'm ok!");
});

export default app;