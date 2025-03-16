/*
  Warnings:

  - You are about to drop the `Scenario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scenario" DROP CONSTRAINT "Scenario_tableId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSession" DROP CONSTRAINT "TrainingSession_tableId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSession" DROP CONSTRAINT "TrainingSession_userId_fkey";

-- DropTable
DROP TABLE "Scenario";

-- DropTable
DROP TABLE "TrainingSession";

-- DropEnum
DROP TYPE "ScenarioType";
