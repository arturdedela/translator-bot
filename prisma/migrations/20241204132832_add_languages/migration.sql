-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "translatedMessagesCount" BIGINT NOT NULL DEFAULT 0;
