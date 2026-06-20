import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const authController = {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const result = await authService.register(dto);
      res.status(201).json(apiResponse(201, MESSAGES.REGISTER_SUCCESS, result));
    } catch (error: any) {
      const status = error?.status ?? 500;
      res.status(status).json(apiResponse(status, error?.message ?? MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.VALIDATION_ERROR));
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
      res.json(apiResponse(200, MESSAGES.LOGIN_SUCCESS, result));
    } catch (error: any) {
      const status = error?.status ?? 500;
      res.status(status).json(apiResponse(status, MESSAGES.INVALID_CREDENTIALS, undefined, ERROR_CODES.INVALID_CREDENTIALS));
    }
  },

  async me(req: Request, res: Response): Promise<void> {
    res.status(200).json(apiResponse(200, MESSAGES.USER_FOUND, req.user));
  },
};
