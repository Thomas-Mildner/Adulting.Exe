-- CreateTable
CREATE TABLE "PackageReturn" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "targetVendor" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountExpected" DOUBLE PRECISION NOT NULL,
    "refundReceived" BOOLEAN NOT NULL DEFAULT false,
    "dateSent" TIMESTAMP(3) NOT NULL,
    "returnWindow" TIMESTAMP(3) NOT NULL,
    "receiptPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageReturn_pkey" PRIMARY KEY ("id")
);
