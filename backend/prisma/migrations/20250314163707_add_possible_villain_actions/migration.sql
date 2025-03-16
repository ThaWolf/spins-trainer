/*
  Warnings:

  - You are about to drop the column `maxScenarios` on the `PreflopTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreflopTable" DROP COLUMN "maxScenarios",
ADD COLUMN     "possibleVillainActions" "Action"[];
