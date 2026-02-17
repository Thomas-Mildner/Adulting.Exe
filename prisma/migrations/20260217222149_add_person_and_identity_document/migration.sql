/*
  Warnings:

  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarMaintenance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FuelEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TollEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarDocument" DROP CONSTRAINT "CarDocument_carId_fkey";

-- DropForeignKey
ALTER TABLE "CarMaintenance" DROP CONSTRAINT "CarMaintenance_carId_fkey";

-- DropForeignKey
ALTER TABLE "FuelEntry" DROP CONSTRAINT "FuelEntry_carId_fkey";

-- DropForeignKey
ALTER TABLE "TollEntry" DROP CONSTRAINT "TollEntry_carId_fkey";

-- DropTable
DROP TABLE "Car";

-- DropTable
DROP TABLE "CarDocument";

-- DropTable
DROP TABLE "CarMaintenance";

-- DropTable
DROP TABLE "FuelEntry";

-- DropTable
DROP TABLE "TollEntry";

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityDocument" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "customDocumentType" TEXT,
    "documentNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "photoFrontPath" TEXT,
    "photoBackPath" TEXT,
    "physicalLocation" TEXT,
    "lostFoundGuide" TEXT,
    "emergencyContact" TEXT,
    "notes" TEXT,
    "personId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IdentityDocument" ADD CONSTRAINT "IdentityDocument_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
