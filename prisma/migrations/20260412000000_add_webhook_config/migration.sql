-- AlterTable
ALTER TABLE "AppConfig" ADD COLUMN "webhookEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AppConfig" ADD COLUMN "webhookUrl" TEXT;

-- CreateTable
CREATE TABLE "WebhookDispatched" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDispatched_pkey" PRIMARY KEY ("id")
);
