# Backlog

Items deferred from the MVP. Each entry has: what, why deferred, what unblocks it, and where the code lives.

---

## Rate limiting on `/api/auth/callback/credentials`

**What:** Apply a request rate limit to the NextAuth credentials login endpoint to prevent brute-force attacks.

**Why deferred:** Requires either Redis (for distributed rate limiting) or an in-process store. No Redis in MVP compose stack.

**What unblocks it:** Add a `redis` service to `docker-compose.yml`, then use `next-rate-limit` or `upstash/ratelimit` with the Redis connection.

**Where:** `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/auth.ts`

---

## Habit failure cron automation

**What:** Automatically run the `/api/cron/habits` endpoint on a schedule (e.g., midnight daily) so missed habits are penalized without manual intervention.

**Why deferred:** Needs an external scheduler. The endpoint itself is built and tested manually via `make habits-check`.

**What unblocks it:** Add a cron container to `docker-compose.yml` (e.g., `mcuadros/ofelia` or `aptible/supercronic`) configured to `POST /api/cron/habits` with the `CRON_SECRET` header.

**Where:** `src/app/api/cron/habits/route.ts`, `docker-compose.yml`

---

## PWA / Offline mode

**What:** Make the app installable as a Progressive Web App with offline capability (service worker, manifest, app icon).

**Why deferred:** Not needed for initial local use; adds build complexity.

**What unblocks it:** Add `next-pwa` or Serwist to `package.json` and configure the Next.js build.

**Where:** `next.config.ts`, `public/`

---

## Character title system

**What:** A `titles` table mapping level thresholds to titles (e.g., "Shadow Monarch" at level 90+) with unlock history. Currently titles are hard-coded in `getTitleForLevel()`.

**Why deferred:** Hard-coded titles work for MVP. A table allows custom titles and achievement unlocks.

**What unblocks it:** Add `Title` and `CharacterTitle` models to `prisma/schema.prisma`, seed initial titles, update `getTitleForLevel()` to query the DB.

**Where:** `src/lib/game/ranks.ts` (`getTitleForLevel`), `prisma/schema.prisma`

---

## Quest categories / tags

**What:** Allow quests to be tagged (e.g., "fitness", "coding", "reading") for filtering and stat routing (completing a "fitness" quest could also buff STR).

**Why deferred:** Adds complexity to the quest form and display without clear benefit at MVP.

**What unblocks it:** Add `tags String[]` to the `Quest` model (Prisma supports PostgreSQL arrays), update the create form and list filters.

**Where:** `prisma/schema.prisma` (`Quest` model), `src/components/quests/CreateQuestDialog.tsx`, `src/app/(app)/quests/page.tsx`
