import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export type AppError = Error & {
  name: string;
};

export default function errorHandlingMiddleware(
  error: Error | AppError,
  request: Request,
  response: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {

  if (error.name === 'notFoundError') {
      return response.status(httpStatus.NOT_FOUND).send(error.message);
  }

  if (error.name === 'invalidIdError') {
      return response.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  }

  console.log("error: ", error);
  return response.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}