-- CreateTable
CREATE TABLE "MessagesAwaitingTranslation" (
    "id" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MessagesAwaitingTranslation_pkey" PRIMARY KEY ("id")
);
