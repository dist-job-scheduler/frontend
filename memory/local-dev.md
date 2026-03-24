# Local Fullstack Dev Guide

## Two blockers (both now fixed)

### 1. CORS
Browser blocks `fetch("http://localhost:8080/...")` from `localhost:3000` because the
`Authorization` header triggers a CORS preflight — and the backend has no CORS middleware.

**Fix**: Next.js proxy rewrite in `next.config.ts`:
```ts
async rewrites() {
  return [{
    source: "/api/:path*",
    destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/:path*`,
  }];
}
```
`api.ts` defaults to `"/api"` (no `NEXT_PUBLIC_API_URL` set locally) → Next.js forwards
server-side → no CORS.

### 2. Auth mismatch (JWT)
Frontend sends Clerk RS256 JWTs. Backend without `CLERK_JWKS_URL` falls back to HS256
and rejects them with 401.

**Fix**: `CLERK_JWKS_URL` is now enabled in `core-api/.envrc`:
```
export CLERK_JWKS_URL=https://unique-quagga-17.clerk.accounts.dev/.well-known/jwks.json
```
(Derived from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → base64 decode → `unique-quagga-17.clerk.accounts.dev`)

## Full startup sequence

### Prerequisites
```bash
brew install goose          # DB migrations
brew install direnv         # env var loader
eval "$(direnv hook zsh)"  # add to ~/.zshrc if not done
docker compose up -d postgres  # in core-api/
```

### Terminal 1 — API server
```bash
cd ../core-api
direnv allow                # approve .envrc (first time or after changes)
docker compose up -d postgres
goose -dir ./migrations postgres "$DATABASE_URL" up
go run ./cmd/server         # → :8080
```

### Terminal 2 — Scheduler (for job execution)
```bash
cd ../core-api
go run ./cmd/scheduler      # worker + reaper
```

### Terminal 3 — Frontend
```bash
cd frontend
npm run dev                 # → localhost:3000
```
Open http://localhost:3000, sign in with Clerk → dashboard connects to local backend.

## Seeding test data
```bash
cd ../core-api
go run ./cmd/seed
# Creates seed@test.local + 20 jobs (mix of success/fail/timeout)
# Prints job IDs and curl commands
```

## Testing API directly (with API token)
1. Sign in to the dashboard at localhost:3000
2. Go to Settings → create an API token, copy it (shown once)
3. Use it in curl:
```bash
export TOKEN="fliq_sk_..."
curl http://localhost:8080/jobs -H "Authorization: Bearer $TOKEN"
```

## Prod vs local env var
| Context | `NEXT_PUBLIC_API_URL` | Result |
|---|---|---|
| Local dev | unset (commented out) | `/api/*` → proxy → `:8080` |
| Production | `https://api.fliq.sh` | Direct call (needs CORS on backend) |

To re-enable prod URL locally (e.g. test against staging):
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.fliq.sh
```
