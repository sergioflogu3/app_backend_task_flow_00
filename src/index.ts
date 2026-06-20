import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import prisma from './config/prisma';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middleware/error.middleware';
import { apiResponse } from './utils/api-response';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import projectsRouter from './routes/projects';
import authRouter from './routes/auth';
import commetsRouter from './routes/commets';
import tasksRouter from './routes/tasks';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commetsRouter);
app.use('/api/tasks', tasksRouter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(swaggerSpec);
});

//Ruta raiz informativa
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '🚀 TaskFlow API',
        version: '1.0.0',
        docs: '/api-docs',
    });
});

//Manejo de errores encontrados
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json(apiResponse(404, 'Ruta no encontrada', undefined, 'NOT_FOUND'));
});

// Iniciar el servidor
async function main() {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida');


    app.listen(port, () => {
        console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${port}`);
        console.log(`🔍 Health check: http://localhost:${port}/health`);
    });
}

main().catch((err) => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    process.exit(1);
});

export default app;