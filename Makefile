.PHONY: dev up down migrate seed studio logs habits-check hash-password

# Development (hot-reload, volume mounts)
dev:
	docker compose up --build

# Production build
up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build

down:
	docker compose down

# Database operations
migrate:
	docker compose exec app npx prisma migrate deploy

migrate-dev:
	docker compose exec app npx prisma migrate dev

seed:
	docker compose exec app npx ts-node --project prisma/tsconfig.json prisma/seed.ts

studio:
	docker compose --profile dev up studio

# App operations
logs:
	docker compose logs -f app

habits-check:
	@curl -s -X POST http://localhost:3000/api/cron/habits \
		-H "Authorization: Bearer $${CRON_SECRET}" | jq .

# Generate ADMIN_PASSWORD_HASH_B64 for .env
# Usage: make hash-password PASSWORD=yourpassword
hash-password:
	@docker run --rm node:20-alpine sh -c \
		"cd /tmp && npm install bcryptjs -q 2>/dev/null && \
		node -e \"const b=require('./node_modules/bcryptjs');b.hash('$(PASSWORD)',12).then(h=>{const b64=Buffer.from(h).toString('base64');console.log('ADMIN_PASSWORD_HASH_B64='+b64);})\""
