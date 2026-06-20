# AGENTS.md — TaskFlow Backend

## Stack
- Express 5 + TypeScript (strict mode)
- Prisma ORM with `@prisma/adapter-pg` + `pg` Pool (connection pooling)
- PostgreSQL
- bcryptjs for password hashing, jsonwebtoken for JWT

## Dev Commands
```bash
npm run dev   # ts-node-dev with hot-reload (transpile-only)
npm run build # tsc → dist/
npm start    # node dist/index.js
```

## No test/lint/typecheck scripts configured

## Prisma
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- **Prisma singleton pattern**: uses `global.__prisma` to survive hot-reload in dev
- Connection uses `pg` Pool + `PrismaPg` adapter (not default Prisma client)
- Run migrations: `npx prisma migrate dev`

## Architecture
- `src/index.ts` — entry point, registers middleware and routes
- `src/routes/*.ts` — route definitions (no logic)
- `src/controllers/*.controller.ts` — request/response handling
- `src/services/*.service.ts` — business logic and DB access via Prisma
- `src/config/prisma.ts` — Prisma client singleton
- `src/types/*.types.ts` — DTOs and public types
- `src/middleware/*.middleware.ts` — auth and validation middleware
- `src/schemas/*.schemas.ts` — Zod validation schemas

## Important Patterns
- Passwords hashed with bcrypt (10 rounds) before storage
- `UserPublic` type excludes `passwordHash` from API responses
- Controllers check for `P2025` Prisma error code for "record not found"
- Error handler in `index.ts` takes 4 params (next is required Express signature)

## Env vars
```
PORT=3000
DATABASE_URL=postgresql://...
NODE_ENV=development
JWT_SECRET=...        # used for signing/verifying JWT tokens
JWT_EXPIRES_IN=7d     # JWT token expiration
```

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/api/health` | Health check with DB status |
| GET/POST | `/api/users` | List/create users |
| GET/PUT/DELETE | `/api/users/:id` | Get/update/delete user |
| GET/POST | `/api/projects` | List/create projects |
| GET/PUT/DELETE | `/api/projects/:id` | Get/update/delete project |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (auth required) |

**Note**: Task routes exist in `src/routes/tasks.ts` but are not registered in `src/index.ts`.

## Database Models (Prisma)
`User → Project → Task → Comment` (with `Status` enum: TODO, IN_PROGRESS, DONE, CANCELLED)
