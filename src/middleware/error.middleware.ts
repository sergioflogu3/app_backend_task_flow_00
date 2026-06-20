import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err?.status ?? 500;
  const message = err?.message ?? MESSAGES.INTERNAL_ERROR;
  const errorCode = err?.code ?? ERROR_CODES.INTERNAL_ERROR;

  res.status(status).json(apiResponse(status, message, undefined, errorCode));
};
