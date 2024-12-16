/*
  Warnings:

  - The `translator` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TranslatorName" AS ENUM ('GPT', 'GOOGLE');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "translator",
ADD COLUMN     "translator" "TranslatorName" NOT NULL DEFAULT 'GOOGLE';

-- DropEnum
DROP TYPE "Translator";
