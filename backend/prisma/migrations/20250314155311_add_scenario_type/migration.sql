/*
  Warnings:

  - You are about to drop the column `expectedAction` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `villainAction` on the `Scenario` table. All the data in the column will be lost.
  - Changed the type of `scenarioType` on the `Scenario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('OPEN', 'MIN_RAISE', 'ALL_IN');

-- AlterTable
ALTER TABLE "Scenario" DROP COLUMN "expectedAction",
DROP COLUMN "villainAction",
DROP COLUMN "scenarioType",
ADD COLUMN     "scenarioType" "ScenarioType" NOT NULL;

-- DropEnum
DROP TYPE "VillainAction";
