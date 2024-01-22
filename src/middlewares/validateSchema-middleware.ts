import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ObjectSchema } from 'joi';

export function validateSchemaMiddleware(schema: ObjectSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const validation = schema.validate(request.body);

    if (validation.error) {
      return response.status( httpStatus.UNPROCESSABLE_ENTITY).send( { error: validation.error.message } );
    };

    next();
  };
}