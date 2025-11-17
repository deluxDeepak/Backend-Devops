# Config — Application Settings

Config: Application की runtime settings जिन्हें बदलने के लिए code नहीं बदलना चाहिए (environment-driven).

## Purpose
- Centralize environment-specific values (DB URL, ports, API keys).
- Keep secrets and deploy-time settings out of source control.
- Provide sane defaults and per-environment overrides (development / test / production).
- Configure infrastructure-level concerns: logging, metrics, security, rate limits.

## Production-ready checklist
- Environment management (dev/test/prod) with validated loader.
- Secrets & credentials stored in env or secret manager (never hard-code).
- DB connection config and pooling.
- Logger configuration (structured logs, rotation, level by env).
- Security middleware settings (CORS, Helmet, cookie/session options).
- Rate limiting and request-throttling.
- Health checks and graceful shutdown settings.
- Config validation at startup (fail fast on missing critical values).
- Observability hooks (correlation IDs, metrics, error reporting).

## Recommended files (src/config/)
- index.js        — Load, merge (defaults + env overrides) and validate config at startup.
- default.js      — Common default values used across environments.
- development.js  — Development-specific overrides (local DB, debug settings).
- production.js   — Production-specific overrides (higher timeouts, stricter security).
- test.js         — Test-specific overrides (in-memory DB, deterministic values).
- database.js     — Database connection settings, pool sizes, retry policies.
- logger.js       — Central logger setup (winston/pino), formats, transports, rotation.
- security.js     — Helmet, cookie/session, cookie options and other security flags.
- cors.js         — Allowed origins and CORS options.
- ratelimit.js    — Rate-limit rules and middleware configuration.
- secrets.example.env or .env.example — Example env variables (do not commit real secrets).
- readme.config.md — This documentation file.

## One-line purpose for each file (why it matters)

### Environment Config
- index.js — Merge + validate config so the app fails fast with clear errors on bad/missing env.
- default.js — Provide safe defaults to avoid duplicate values and unexpected behavior.
- development.js — Make local development convenient (verbose logs, local DB).
- production.js — Harden settings for security, observability and stability in production.
- test.js — Provide isolated, stable config for CI and unit tests.

## Database Config
- database.js — Centralize DB options to manage pooling, timeouts and retries consistently.

## App Setting
- logger.js — Ensure structured logs, controlled level and rotation for observability and debugging.
- security.js — Central place for security best-practices to avoid misconfiguration.
- cors.js — Single source of truth for allowed origins, preventing accidental open CORS.
- ratelimit.js — Protect the app from abuse and DoS by enforcing request limits.
- .env.example — Document required env vars and safe example values for onboarding.

## Logger considerations (production-ready)
- Use structured (JSON) logs for easier ingestion.
- Configure level via LOG_LEVEL and environment.
- Add metadata: service name, env, request-id, user-id when available.
- Use daily rotation or size-based rotation to avoid disk fill.
- Do not log secrets or PII.
- Provide fallback to console when remote sinks are unavailable.

## Startup order (recommended)
1. Load .env (only in non-production if you use dotenv).
2. Initialize and validate config (index.js).
3. Initialize logger (logger.js) with config metadata.
4. Initialize DB and other services.
5. Start server and health checks.

## Quick .env.example (minimal)
- NODE_ENV=development
- PORT=3000
- DATABASE_URL=postgres://user:pass@localhost:5432/db
- JWT_SECRET=change_me
- LOG_LEVEL=debug
