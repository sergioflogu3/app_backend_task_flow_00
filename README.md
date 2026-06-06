# TaskFlow API

Backend de la aplicación TaskFlow construido con **Express 5**, **TypeScript** y **PostgreSQL**.

## Requisitos

- Node.js >= 18
- PostgreSQL >= 14

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/taskflow
NODE_ENV=development
```

## Scripts

| Comando           | Descripción                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Inicia el servidor en modo desarrollo (hot-reload) |
| `npm run build`   | Compila TypeScript a JavaScript en `dist/`      |
| `npm start`       | Ejecuta el servidor desde `dist/index.js`       |

## Endpoints

### `GET /`

Información básica de la API.

### `GET /api/health`

Verifica el estado del servidor y la conexión a la base de datos.

```json
{
  "status": "ok",
  "message": "TaskFlow API funcionando correctamente",
  "database": {
    "status": "connected",
    "timestamp": "2025-01-01T00:00:00.000Z"
  },
  "environment": "development"
}
```

## Estructura

```
src/
├── config/
│   └── database.ts      # Configuración y conexión a PostgreSQL
├── routes/
│   └── health.ts        # Ruta de health check
└── index.ts             # Punto de entrada de la aplicación
```
