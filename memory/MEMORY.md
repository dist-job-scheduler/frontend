# Fliq Frontend — Session Memory

## Project
- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4, shadcn/ui, Clerk v6
- Backend: Go (Gin) at ../core-api — runs on :8080
- Frontend dev: `npm run dev` → localhost:3000

## Key files
- `src/lib/api.ts` — all API types + fetch wrapper (Clerk JWT auth)
- `src/components/dashboard/` — JobsTable, SchedulesTable, ExecutionsTable, ApiCodeBlock
- `src/app/app/` — protected dashboard pages
- `next.config.ts` — has `/api/*` → `http://localhost:8080` proxy rewrite
- `.env.local` — Clerk keys; prod API URL commented out for local dev

## Local fullstack dev setup
See `memory/local-dev.md` for the full guide.

### Quick start
```bash
# Terminal 1 — backend
cd ../core-api
direnv allow          # loads .envrc (DB URL, JWT_SECRET, CLERK_JWKS_URL)
docker compose up -d postgres
goose -dir ./migrations postgres "$DATABASE_URL" up
go run ./cmd/server

# Terminal 2 — scheduler (optional, needed for job execution)
cd ../core-api
go run ./cmd/scheduler

# Terminal 3 — frontend
cd frontend
npm run dev           # http://localhost:3000
```

## Auth architecture
- Frontend: Clerk JWT (RS256), sent as `Authorization: Bearer <jwt>`
- Backend: validates via Clerk JWKS when `CLERK_JWKS_URL` set; falls back to HS256 locally
- API tokens: `fliq_sk_*` prefix, SHA-256 hashed in DB, for programmatic access
- Clerk JWKS URL: `https://unique-quagga-17.clerk.accounts.dev/.well-known/jwks.json`

## CORS / proxy pattern
- Browser calls `/api/*` (same origin) → Next.js proxy → `localhost:8080` (no CORS!)
- Controlled by `BACKEND_URL` env var (server-side), defaults to `http://localhost:8080`
- For production: set `NEXT_PUBLIC_API_URL=https://api.fliq.dev` to bypass proxy entirely

## Dashboard status
All pages fully connected to real backend (no mocks):
- Jobs: list/create/cancel, stats row, skeleton loaders
- Schedules: list/create/pause/resume/delete
- Executions: aggregates jobs + attempts (read-only)
- Settings: API token management (create/revoke, one-time reveal)

## Code examples feature (added)
- `ApiCodeBlock.tsx` — shared tabbed code block (curl/TypeScript/Go/Python)
- `JOB_SNIPPETS` and `SCHEDULE_SNIPPETS` exported constants
- Toggle button ("API" / "Hide API") in Jobs and Schedules header rows
