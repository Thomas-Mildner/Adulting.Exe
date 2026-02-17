/*
  Warnings:

  - You are about to drop the column `filePath` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "filePath",
DROP COLUMN "fileSize",
DROP COLUMN "mimeType";

-- AlterTable
ALTER TABLE "Insurance" ALTER COLUMN "deductible" DROP DEFAULT;

-- CreateTable
CREATE TABLE "NotificationRead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("id")
);
