-- CreateEnum
CREATE TYPE "Position" AS ENUM ('BTN', 'SB', 'BB');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BASIC', 'PRO', 'ELITE');

-- CreateEnum
CREATE TYPE "VillainAction" AS ENUM ('NONE', 'OR', 'LIMP');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('NONE', 'CALL', 'BET', 'ALL_IN', 'FOLD');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreflopTable" (
    "id" SERIAL NOT NULL,
    "heroPosition" "Position" NOT NULL,
    "villainPosition" "Position" NOT NULL,
    "level" "Level" NOT NULL,
    "variation" TEXT NOT NULL,
    "rangeData" TEXT NOT NULL,

    CONSTRAINT "PreflopTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,
    "hand" TEXT NOT NULL,
    "actionTaken" "Action" NOT NULL,
    "correctAction" "Action" NOT NULL,
    "result" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" SERIAL NOT NULL,
    "tableId" INTEGER NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "villainAction" "VillainAction" NOT NULL,
    "expectedAction" "Action" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "PreflopTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "PreflopTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
