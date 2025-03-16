/*
  Warnings:

  - Changed the type of `rangeData` on the `PreflopTable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PreflopTable" DROP COLUMN "rangeData",
ADD COLUMN     "rangeData" JSONB NOT NULL;
