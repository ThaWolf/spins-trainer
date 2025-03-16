/*
  Warnings:

  - You are about to drop the column `possibleVillainActions` on the `PreflopTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreflopTable" DROP COLUMN "possibleVillainActions",
ADD COLUMN     "villainGoesFirst" BOOLEAN NOT NULL DEFAULT false;
