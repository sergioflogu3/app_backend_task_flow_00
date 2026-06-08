import { Router, Request, Response } from 'express';
import prisma from '../config/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await prisma.$queryRaw<[{ timestamp: Date }]>`SELECT NOW() as timestamp`;
        res.json({
          status: 'ok',
          message: 'TaskFlow API funcionando correctamente',
          database: {
            status: 'connected',
            timestamp: result[0].timestamp,
          },
          environment: process.env.NODE_ENV || 'development',
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Error de conexión a la base de datos',
          database: {
            status: 'disconnected',
          },
        });
      }
    
});

export default router;
