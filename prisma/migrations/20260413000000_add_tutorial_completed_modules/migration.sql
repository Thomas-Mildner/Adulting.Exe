-- AlterTable
ALTER TABLE "AppConfig" ADD COLUMN "tutorialCompletedModules" TEXT[] NOT NULL DEFAULT '{}';
