---
alwaysApply: true
---

Secure Coding Rules for AI-Assisted Changes

These rules guide the AI to default to secure, scalable patterns and avoid common pitfalls like SQL injection, missing input validation, and hallucinated dependencies. Apply these for all backend and API work unless a maintainer explicitly opts out.

Global Principles

- Treat all external input as untrusted; validate and sanitize at boundaries.
- Prefer existing project dependencies and the standard library before proposing new packages.
- When suggesting new libraries, provide justification, install command, version pin, and a standard-library fallback.
- Default to defense-in-depth: validation + parameterized queries + least privilege + rate limiting.
- Never log secrets or print stack traces in production. Use structured logs.

Database and SQL (Prevent SQL Injection)

- Always use parameterized queries or safe ORM/query builders. Never build SQL with string concatenation or template literals.
- Prefer ORMs/query builders with prepared statements enabled by default (e.g., Prisma, Sequelize, TypeORM, SQLAlchemy, JOOQ, Entity Framework).
- Examples (DO vs DON’T):
  - Node.js (pg): DO `client.query('SELECT * FROM users WHERE id = $1', [id])`; DON’T ``client.query(`SELECT * FROM users WHERE id = ${id}`)``.
  - Python (psycopg2): DO `cur.execute('... WHERE id = %s', (user_id,))`; DON’T use f-strings or `+` to build SQL.
  - Java (JDBC): DO `PreparedStatement ps = con.prepareStatement("... WHERE id = ?"); ps.setInt(1, id);`
  - C# (SqlClient): DO `cmd.Parameters.Add(new SqlParameter("@id", id));`
  - PHP (PDO): DO `$stmt = $pdo->prepare('... WHERE id = ?'); $stmt->execute([$id]);`
- Escape/quote helpers are not a replacement for parameters; use parameters first.
- Apply least-privilege DB users; limit permissions to the minimum needed for the feature.
- Enforce query timeouts and connection pooling; avoid N+1 queries; paginate results.

Input Validation and Output Encoding

- Validate all inputs server-side using a schema. Reject unknown fields, enforce types, ranges, and length limits.
- Recommended validators by ecosystem:
  - TypeScript/Node: `zod`, `yup`, `joi`, `class-validator`
  - Python: `pydantic`/`pydantic-core`, `marshmallow`
  - Java: Bean Validation (Jakarta Validation, `javax.validation`/`jakarta.validation`)
  - C#: DataAnnotations or FluentValidation
  - PHP: Symfony Validator or Laravel Form Requests
- Normalize and sanitize: trim strings, normalize Unicode (NFC), enforce allowed character sets where applicable.
- For text rendered in HTML, encode output context-appropriately rather than stripping blindly.
- Cap payload sizes; configure body parsers with size limits and fail fast on overflows.

Rate Limiting and Abuse Prevention

- Implement per-IP and per-identity (API key/user) rate limits on all public endpoints.
- Return HTTP 429 on limit; include `Retry-After` when applicable.
- Suggested libraries/patterns:
  - Node/Express: `express-rate-limit` (optionally backed by Redis for distributed limits)
  - Django/DRF: built-in throttling classes; configure `DEFAULT_THROTTLE_RATES`
  - Flask: `Flask-Limiter` with a shared store (Redis/Memcached)
  - ASP.NET: built-in `RateLimiter` middleware
  - Edge/gateway: NGINX/Envoy/API Gateway rate limiting where available
- Add coarse global and fine-grained per-route limits; protect login, signup, password reset, and search endpoints with stricter limits.
- Implement timeouts, retries with jitter, and idempotency keys for mutating endpoints.

Dependencies and Supply Chain (Avoid Hallucinated Packages)

- Do not invent or rely on packages that do not exist. Prefer standard library or existing project deps.
- Before proposing a new dependency:
  - Check if a similar package already exists in the repo’s lockfile (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `requirements.txt`, `Pipfile.lock`, `pom.xml`, `build.gradle`, `Cargo.lock`, `go.mod`, etc.).
  - Provide: name, purpose, minimal version, size/footprint, and why stdlib or existing deps are insufficient.
  - Show install instructions and minimal usage snippet; propose a no-dependency fallback.
- Avoid typosquatting: do not suggest lookalike names. Prefer well-known, maintained libraries.
- Pin versions or use a caret with lower bound to safe, patched versions; prefer LTS lines.
- Never add transitive shell-executing packages for trivial tasks. Keep the dependency surface minimal.

Secrets, Config, and Environment

- Never hardcode secrets or credentials. Load via environment variables or a secrets manager.
- Provide `.env.example` updates for any new config; ensure `.env` stays gitignored.
- Use distinct configs per environment; disable verbose errors and debug in production.
- Enforce CORS restrictions; avoid `*` in production; enumerate allowed origins/methods/headers.

Testing and Verification

- Add unit tests for validators and representative injection attempts (quotes, comment terminators, union selects where relevant) to ensure safe handling.
- Add integration tests that exercise parameterized queries; assert no string-built SQL paths.
- Add tests for rate limiting: exceeding limits yields 429 and appropriate headers.
- Run static analysis where available:
  - JavaScript/TypeScript: `eslint-plugin-security`, `typescript-eslint`
  - Python: `bandit`, `pylint` security checks
  - Go: `gosec`
  - Java: SpotBugs/FindSecBugs

Operational Safeguards

- Set request and DB timeouts; configure reasonable keep-alive and read/write timeouts.
- Enable HTTP security headers (e.g., via helmet for Node) and TLS everywhere.
- Log auth-critical actions with user identifier, request ID, and rate-limit hits, omitting sensitive data.
- For background jobs or webhooks, design idempotent handlers and safe retries.

Pull Request Checklist (Security)

- Inputs validated via schema; unknown fields rejected; size/time limits configured.
- All DB access uses parameters/ORM; no string-built SQL remains.
- Rate limiting in place for public endpoints (especially auth flows).
- No new packages unless justified, verified, and pinned; alternatives considered.
- Secrets not committed; `.env.example` updated; production debug disabled.
- Tests added/updated for validators, rate limiting, and critical flows.

How to Use These Rules in Cursor

- Place this file at `.cursor/rules/secure-coding.md` for repo-wide effect.
- To scope to a specific area, duplicate into subfolders (e.g., `api/.cursor/rules/secure-coding.md`) so the AI applies them only there.
- Keep rules concise and imperative; update alongside code changes that affect security posture.

