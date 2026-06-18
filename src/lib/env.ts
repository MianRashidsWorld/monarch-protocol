import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  ADMIN_USERNAME: z.string().min(1),
  // Stored base64-encoded to avoid $ interpolation issues in docker-compose
  ADMIN_PASSWORD_HASH_B64: z.string().min(10),
  CRON_SECRET: z.string().min(1),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Missing or invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = validateEnv();
