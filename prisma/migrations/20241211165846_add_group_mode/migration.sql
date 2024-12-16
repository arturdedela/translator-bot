-- CreateEnum
CREATE TYPE "GroupChatMode" AS ENUM ('AUTO', 'ASK_ON_EVERY_MESSAGE', 'COMMANDS_ONLY');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "mode" "GroupChatMode";
