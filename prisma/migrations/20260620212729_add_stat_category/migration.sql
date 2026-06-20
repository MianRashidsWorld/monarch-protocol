-- CreateEnum
CREATE TYPE "StatCategory" AS ENUM ('STRENGTH', 'INTELLIGENCE', 'AGILITY', 'WILLPOWER');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "statCategory" "StatCategory";

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "statCategory" "StatCategory";
