-- AlterTable
ALTER TABLE "AppConfig" ADD COLUMN "disabledModules" TEXT[] NOT NULL DEFAULT '{}';
