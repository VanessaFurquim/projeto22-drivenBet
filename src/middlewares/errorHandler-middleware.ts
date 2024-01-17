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

  if (error.name === "notFoundError") {
    return response.status(httpStatus.NOT_FOUND).send(error.message);
  };

  if (error.name === "invalidIdError") {
    return response.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  };

  if (error.name === "balanceError") {
    return response.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  };

  return response.status(httpStatus.INTERNAL_SERVER_ERROR).send(console.log("error: ", error));
};