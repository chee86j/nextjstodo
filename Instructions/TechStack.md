# Tech Stack

## Frontend
- **Framework:** Next.js 14 (App Router) with React 18 server components.
- **Styling:** Tailwind CSS 3, global utility-first styling with responsive variants.
- **Fonts/Iconography:** `next/font` (Inter) with optional Heroicons for UI affordances.
- **State/Data Fetching:** Server Components + server actions, leveraging Prisma directly.
- **Form Handling:** React Server Actions with progressive enhancement (native forms + client hints if needed).

## Backend
- **ORM:** Prisma Client 5.8.x with SQLite datasource (Swappable to Postgres when ready).
- **Database:** Local SQLite file `prisma/dev.db` for development, with Prisma migrations for versioning.
- **API Surface:** Server actions + Route Handlers if additional APIs are required.

## Tooling & Quality
- **Language:** TypeScript (strict mode) to enforce type safety.
- **Linting:** ESLint (`next/core-web-vitals`) with single-quote enforcement to match engineering rules.
- **Testing:** Jest (unit/component) with future Playwright/Cypress for e2e (Phase 11).
- **Package Manager:** npm (Node 18+ runtime assumptions).
- **Dev Experience:** Prisma Studio (optional) for DB inspection, `npm run lint` for CI guardrail.

## Deployment
- **Platform:** Vercel for SSR/static hybrid deployment.
- **Env Management:** `.env` for local; Vercel project settings for prod secrets (`DATABASE_URL`).
- **Migrations:** `npx prisma migrate deploy` executed as part of CI/CD prior to app start.
