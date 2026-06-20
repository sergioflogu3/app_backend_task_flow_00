import { Request, Response } from 'express';
import { usersService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { apiResponse } from '../utils/api-response';
import { MESSAGES } from '../constants/messages';
import { ERROR_CODES } from '../constants/error-codes';

export const usersController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.findAll();
      res.status(200).json(apiResponse(200, 'Usuarios obtenidos correctamente', users));
    } catch {
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.findById(req.params.id as string);
      if (!user) {
        res.status(404).json(apiResponse(404, MESSAGES.USER_NOT_FOUND, undefined, ERROR_CODES.USER_NOT_FOUND));
        return;
      }
      res.status(200).json(apiResponse(200, MESSAGES.USER_FOUND, user));
    } catch {
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserDto;
      if (!name || !email || !password) {
        res.status(400).json(apiResponse(400, MESSAGES.VALIDATION_ERROR, undefined, ERROR_CODES.VALIDATION_ERROR));
        return;
      }
      const exists = await usersService.existsByEmail(email);
      if (exists) {
        res.status(409).json(apiResponse(409, MESSAGES.USER_EMAIL_EXISTS, undefined, ERROR_CODES.EMAIL_EXISTS));
        return;
      }
      const user = await usersService.create({ name, email, password });
      res.status(201).json(apiResponse(201, MESSAGES.USER_CREATED, user));
    } catch {
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UpdateUserDto;
      const user = await usersService.update(req.params.id as string, { name, email });
      res.status(200).json(apiResponse(200, MESSAGES.USER_UPDATED, user));
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2025') {
        res.status(404).json(apiResponse(404, MESSAGES.USER_NOT_FOUND, undefined, ERROR_CODES.USER_NOT_FOUND));
        return;
      }
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await usersService.remove(req.params.id as string);
      res.status(204).json(apiResponse(204, MESSAGES.USER_DELETED));
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'P2025') {
        res.status(404).json(apiResponse(404, MESSAGES.USER_NOT_FOUND, undefined, ERROR_CODES.USER_NOT_FOUND));
        return;
      }
      res.status(500).json(apiResponse(500, MESSAGES.INTERNAL_ERROR, undefined, ERROR_CODES.INTERNAL_ERROR));
    }
  },
};
