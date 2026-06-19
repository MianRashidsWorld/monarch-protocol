# Monarch Protocol

A solo-leveling RPG system for your real life. Complete quests, build habits, earn XP and gold, level up your character, and spend your rewards — all through a dark-themed web app inspired by the *Solo Leveling* universe.

## How it works

Monarch Protocol is a **single-user productivity app** built around RPG mechanics. You play as a Hunter character who levels up by completing real-world tasks.

### Core loop

1. **Create quests** — one-off tasks ranked E through S. Higher ranks reward more XP and gold but represent harder work.
2. **Track habits** — recurring daily or weekly habits. Complete them to earn rewards; miss them and your HP takes a hit.
3. **Level up** — XP accumulates and levels you up. Each level increases your HP/MP cap and grants 3 stat points to allocate across STR, INT, AGI, and WIL.
4. **Spend gold in the shop** — redeem real-world rewards you define (a coffee, a game session, a day off) using gold earned from quests and habits.

### Rank system

Quests are ranked E → D → C → B → A → S, each with preset XP and gold rewards:

| Rank | XP    | Gold |
|------|-------|------|
| E    | 25    | 10   |
| D    | 75    | 25   |
| C    | 150   | 50   |
| B    | 300   | 100  |
| A    | 600   | 200  |
| S    | 1,500 | 500  |

### Character titles

Your title advances as you level up:

| Level range | Title           |
|-------------|-----------------|
| 1–4         | Awakened        |
| 5–9         | E-Rank Hunter   |
| 10–19       | D-Rank Hunter   |
| 20–34       | C-Rank Hunter   |
| 35–49       | B-Rank Hunter   |
| 50–69       | A-Rank Hunter   |
| 70–89       | S-Rank Hunter   |
| 90+         | Shadow Monarch  |

### HP penalty system

Missed habits deduct HP. A cron job (or manual trigger) runs the `habits-check` endpoint to apply penalties for any habits not completed in the current window. If your HP reaches 0 it's a reminder that you've been slacking — complete habits to recover.

---

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **PostgreSQL** via Prisma ORM
- **NextAuth v5** (Credentials provider, single-user)
- **Tailwind CSS** + shadcn/ui + Framer Motion
- **Docker** + docker-compose (dev and prod)

---

## Installation

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Git

### 1. Clone the repo

```bash
git clone https://github.com/MianRashidsWorld/monarch-protocol.git
cd monarch-protocol
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in every value:

| Variable                  | Description                                                              |
|---------------------------|--------------------------------------------------------------------------|
| `DATABASE_URL`            | PostgreSQL connection string (default works with docker-compose)         |
| `POSTGRES_PASSWORD`       | Password for the `db` container (must match `DATABASE_URL`)              |
| `NEXTAUTH_URL`            | Full URL of the app, e.g. `http://localhost:3000`                        |
| `NEXTAUTH_SECRET`         | Random secret — generate with `openssl rand -base64 32`                  |
| `ADMIN_USERNAME`          | Your login username (plain text)                                         |
| `ADMIN_PASSWORD_HASH_B64` | bcrypt hash of your password, base64-encoded (see step 3)                |
| `CRON_SECRET`             | Random secret to protect the cron endpoint — any long random string      |

### 3. Generate your password hash

```bash
make hash-password PASSWORD=yourpassword
```

Copy the printed `ADMIN_PASSWORD_HASH_B64=...` value into your `.env`.

### 4. Start the app

```bash
make dev
```

This runs `docker compose up --build` with hot-reload. The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Run migrations and seed the database

On first run, open a second terminal and run:

```bash
make migrate
make seed
```

`seed` creates Character #1 and a set of starter rewards in the shop. You only need to do this once.

### 6. Log in

Navigate to [http://localhost:3000](http://localhost:3000), enter the `ADMIN_USERNAME` and password you set, and you're in.

---

## Common commands

```bash
make dev           # Start dev server with hot-reload
make up            # Start in production mode
make down          # Stop all containers
make migrate       # Apply pending Prisma migrations
make seed          # Seed the database (first run only)
make studio        # Open Prisma Studio at localhost:5555
make logs          # Tail the app container logs
make habits-check  # Manually trigger HP deduction for missed habits
```

---

## Production deployment

Use the production compose override:

```bash
make up
```

This runs `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build`. Set `NEXTAUTH_URL` to your public domain before deploying.

For the habit penalty cron job, call the endpoint on a schedule (e.g. daily at midnight):

```bash
curl -X POST https://yourdomain.com/api/cron/habits \
  -H "Authorization: Bearer <CRON_SECRET>"
```

---

## License

See [LICENSE](LICENSE).
