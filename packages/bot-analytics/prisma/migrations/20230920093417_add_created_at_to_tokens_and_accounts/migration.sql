/*
  Warnings:

  - Added the required column `createdAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;
