/*
  Warnings:

  - You are about to drop the column `token0Id` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token0Received` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token0Sent` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token1Id` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token1Received` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token1Sent` on the `AccountActivity` table. All the data in the column will be lost.
  - Added the required column `received` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sent` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenId` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_token0Id_fkey";

-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_token1Id_fkey";

-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "token0Id",
DROP COLUMN "token0Received",
DROP COLUMN "token0Sent",
DROP COLUMN "token1Id",
DROP COLUMN "token1Received",
DROP COLUMN "token1Sent",
ADD COLUMN     "received" TEXT NOT NULL,
ADD COLUMN     "sent" TEXT NOT NULL,
ADD COLUMN     "tokenId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
