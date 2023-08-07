/*
  Warnings:

  - You are about to drop the column `amount0Received` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `amount0Sent` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `amount1Received` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `amount1Sent` on the `AccountActivity` table. All the data in the column will be lost.
  - Added the required column `token0Received` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token0Sent` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Received` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Sent` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "amount0Received",
DROP COLUMN "amount0Sent",
DROP COLUMN "amount1Received",
DROP COLUMN "amount1Sent",
ADD COLUMN     "token0Received" INTEGER NOT NULL,
ADD COLUMN     "token0Sent" INTEGER NOT NULL,
ADD COLUMN     "token1Received" INTEGER NOT NULL,
ADD COLUMN     "token1Sent" INTEGER NOT NULL;
