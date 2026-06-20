-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED');

-- AlterTable: add status column, preserving existing isActive data
ALTER TABLE "Habit" ADD COLUMN "status" "HabitStatus" NOT NULL DEFAULT 'ACTIVE';

-- Data migration: isActive=false habits become FAILED
UPDATE "Habit" SET "status" = 'FAILED' WHERE "isActive" = false;

-- Drop old column
ALTER TABLE "Habit" DROP COLUMN "isActive";
