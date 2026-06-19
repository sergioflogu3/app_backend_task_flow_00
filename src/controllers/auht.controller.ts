import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';

export const authController = {

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error?.status ?? 500).json({ error: error?.message ?? 'Error al registrar' });
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
      res.json(result);
    } catch (error: any) {
      res.status(error?.status ?? 500).json({ error: error?.message ?? 'Error al iniciar sesión' });
    }
  },

  // GET /api/auth/me  (ruta protegida — requiere token)
  async me(req: Request, res: Response): Promise<void> {
    // req.user fue adjuntado por el authMiddleware
    res.json({ data: req.user });
  },
};
