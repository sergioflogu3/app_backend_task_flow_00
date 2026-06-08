import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
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

//Ruta raiz informativa
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '🚀 TaskFlow API — Clase 1',
        version: '1.0.0',
        docs: '/health',

    });
});

//Manejo de errores encontrados
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
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