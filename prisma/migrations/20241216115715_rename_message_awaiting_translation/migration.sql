/*
  Warnings:

  - You are about to drop the `MessagesAwaitingTranslation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MessagesAwaitingTranslation";

-- CreateTable
CREATE TABLE "MessageAwaitingTranslation" (
    "id" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MessageAwaitingTranslation_pkey" PRIMARY KEY ("id")
);
