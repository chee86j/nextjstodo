# Product Requirements Document – Next.js Todo CRUD App

## Overview
A responsive task management app built with Next.js 14, Prisma, and Tailwind CSS. Users can create, read, update, and delete todo items with reliable persistence and immediate feedback.

## Goals
- Provide a minimal, accessible interface for capturing and managing todos.
- Ensure realtime-feeling UX via server actions + cache revalidation.
- Maintain a single source of truth in SQLite (upgradeable to Postgres) via Prisma.
- Keep architecture small, composable, and aligned with the engineering rules.

## User Stories
1. As a user, I can view all of my todos sorted by creation date so I always know what is pending.
2. As a user, I can add a new todo with validation feedback so I do not submit empty titles.
3. As a user, I can toggle completion on a todo directly from the list with optimistic feedback.
4. As a user, I can rename an existing todo if my priorities change.
5. As a user, I can delete a todo that is no longer relevant with a confirmation step.
6. As a user, I can see loading, empty, and error states so I know what is happening.

## Non-Goals
- Multi-user auth or sharing.
- Offline support.
- Rich text/attachments.

## Edge Cases
- Duplicate titles should be allowed but trimmed; leading/trailing whitespace removed.
- Submitting blank input should block with inline error messaging.
- Prisma/network failures should surface toast/error banners and preserve user input.
- Concurrent updates must be handled by always fetching the latest data after mutations (`revalidatePath`).

## Success Metrics
- CRUD flows covered by automated tests (unit/integration) with >80% critical-path coverage.
- `npm run lint` and tests green in CI.
- Lighthouse accessibility score ≥ 90 on desktop and mobile for the list page.
