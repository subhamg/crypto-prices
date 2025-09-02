# Crypto Prices (TON/USDT)

## Overview

Simple full-stack app to view current cryptocurrency prices for `TON/USDT` and `USDT/TON`.

## Tech Choices

- Backend: NestJS (structured modules, DI, testing utilities). HTTP client via Axios. Cache via Redis. Persistence via TypeORM + Postgres.
- Frontend: Next.js App Router + React Query for data fetching/caching, Mantine for UI primitives.

## Running with Docker

Requirements: Docker and Docker Compose.

```bash
docker compose up --build
```

Services:

- frontend: http://localhost:3000
- backend: http://localhost:9000
- redis: localhost:6379
- postgres: localhost:5432 (user: app / pass: app / db: crypto)

The frontend proxies `/api/*` to the backend. You can override with `BACKEND_URL`.

## Environment

Backend (`backend/.env`):

```env
# HTTP
PORT=9000

# Redis cache
REDIS_HOST=redis
REDIS_PORT=6379

# External provider
COINGECKO_BASE=https://api.coingecko.com/api/v3

# Postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=app
POSTGRES_PASSWORD=app
POSTGRES_DB=crypto

# Cache TTL (seconds). Validated 1..1800 (30 minutes).
CACHE_TTL_SECONDS=60
```

Frontend (`frontend/.env.local`):

```env
# Used by Next.js rewrites() on the server
BACKEND_URL=http://localhost:9000
```

Notes:

- These are passed at runtime via docker-compose `environment`. Avoid baking secrets into images.
- For client-side usage in Next.js, envs must be prefixed with `NEXT_PUBLIC_` and available at build time. This app only uses `BACKEND_URL` on the server (rewrites), so runtime is sufficient.

## Local Development

Backend

```bash
cd backend
npm i
cp .env.example .env # set env vars
npm run start:dev
```

Frontend

```bash
cd frontend
npm i
cp .env.example .env.local
npm run dev
```

## API

- GET `/prices/pairs` → `{ pairs: ["TON/USDT","USDT/TON"] }`
- GET `/prices/price?base=TON&quote=USDT` → `{ pair, price, source, asOf, ttlSeconds }`

- Sources: CoinGecko simple price API.
- Cache: Redis with configurable TTL (`CACHE_TTL_SECONDS`, default 60s, up to 1800s/30m to meet freshness requirement).
- DB: a `price_snapshots` table stores persisted snapshots on cache miss; extendable to history endpoints.

## Tests

- Backend: unit tests for controller and service (cache hit/miss, provider integration), repository mocked.
- Frontend: React Testing Library test for `PriceViewer` rendering data.

Run:

```bash
cd backend && npm test
cd ../frontend && npm test
```

## Improvements

- Multiple providers & failover: add CoinMarketCap adapter; provider router with health checks, retries with backoff, circuit breaker; aggregate via median of providers.
- Historical data: schedule periodic snapshots (cron/worker), store time‑series, and add `/prices/history?base=&quote=&from=&to=&interval=1m|5m|1h`; consider TimescaleDB for performance.
- Caching strategy: configurable TTL per pair/provider, pre‑warm popular pairs, and return remaining TTL in responses.
- Observability: structured logging, Prometheus metrics, OpenTelemetry tracing; dashboards and alerts.
- Security & hardening: rate limiting, strict input validation, CORS policy, secrets via env/Docker secrets; TLS for Postgres/Redis.
- Database lifecycle: TypeORM migrations (disable synchronize in prod), seed scripts, migration CI checks.
- CI/CD: GitHub Actions to run tests/lint, build/push images, optional preview deploys.
- Frontend UX: auto‑refresh toggle, resilient error/retry states, accessibility improvements, and e2e tests.
