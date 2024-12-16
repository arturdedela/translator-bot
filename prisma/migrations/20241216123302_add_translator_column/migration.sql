-- CreateEnum
CREATE TYPE "Translator" AS ENUM ('GPT', 'GOOGLE');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "translator" "Translator" NOT NULL DEFAULT 'GOOGLE';
