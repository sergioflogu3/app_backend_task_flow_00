import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthenticatedUser } from '../types/auth.types';
import { apiResponse } from '../utils/api-response';

const EXCLUDED_ROUTES = [
  { method: 'POST', path: '/auth/register' },
  { method: 'POST', path: '/auth/login' },
];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(apiResponse(401, 'Token de autenticación requerido', undefined, 'INVALID_TOKEN'));
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json(apiResponse(401, 'Token no proporcionado', undefined, 'INVALID_TOKEN'));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    } as AuthenticatedUser;
    next();
  } catch {
    res.status(401).json(apiResponse(401, 'Token inválido o expirado', undefined, 'INVALID_TOKEN'));
  }
};

export const createAuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const fullPath = req.path;

    const isExcluded = EXCLUDED_ROUTES.some(
      (route) => req.method === route.method && fullPath === route.path
    );

    if (isExcluded) {
      next();
      return;
    }

    authMiddleware(req, res, next);
  };
};
