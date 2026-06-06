# Clase 1 — TaskFlow API

Backend con Express 5 + TypeScript + PostgreSQL.

---

## 1. Inicialización del proyecto

```bash
mkdir app_taskflow_backend
cd app_taskflow_backend
npm init -y
npm install express cors dotenv pg
npm install -D typescript @types/node @types/express @types/cors @types/pg ts-node-dev
npx tsc --init
```

---

## 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 3. `package.json` — scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

## 4. Archivo `.env`

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/taskflow
NODE_ENV=development
```

---

## 5. Código fuente

### `src/config/database.ts`

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conexión a PostgreSQL establecida');
        release();
    }
});

export default pool;
```

### `src/routes/health.ts`

```typescript
import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW() as timestamp');
        res.json({
          status: 'ok',
          message: 'TaskFlow API funcionando correctamente',
          database: {
            status: 'connected',
            timestamp: result.rows[0].timestamp,
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
```

### `src/index.ts`

```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '🚀 TaskFlow API — Clase 1',
        version: '1.0.0',
        docs: '/health',
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(port, () => {
    console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${port}`);
    console.log(`🔍 Health check: http://localhost:${port}/health`);
});

export default app;
```

---

## 6. Ejecutar

```bash
npm run dev
```

---

## 7. Endpoints

| Método | Ruta           | Descripción                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/`            | Info general de la API          |
| GET    | `/api/health`  | Health check con estado de la BD |

---

## 8. Errores comunes y soluciones

| Error                              | Causa                              | Solución                                      |
| ---------------------------------- | ---------------------------------- | --------------------------------------------- |
| `Cannot find module 'index.ts'`    | Ejecutar con `node` en vez de `ts-node-dev` | Usar `npm run dev`                   |
| `PORT is not defined`              | Variable mal escrita               | Usar `port` (minúscula) consistente           |
| `res.status is not a function`     | Middleware de error con 3 params   | Agregar 4º parámetro `next`                   |
