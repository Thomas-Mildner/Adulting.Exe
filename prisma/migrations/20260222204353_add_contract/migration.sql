-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "accountId" TEXT,
    "monthlyCost" DOUBLE PRECISION NOT NULL,
    "yearlyCost" DOUBLE PRECISION,
    "category" TEXT NOT NULL,
    "lastUsedDate" TIMESTAMP(3),
    "isTrial" BOOLEAN NOT NULL DEFAULT false,
    "trialEndDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
