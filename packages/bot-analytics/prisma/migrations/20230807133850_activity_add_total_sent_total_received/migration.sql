/*
  Warnings:

  - Added the required column `totalReceived` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSent` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountActivity" ADD COLUMN     "totalReceived" TEXT NOT NULL,
ADD COLUMN     "totalSent" TEXT NOT NULL;
