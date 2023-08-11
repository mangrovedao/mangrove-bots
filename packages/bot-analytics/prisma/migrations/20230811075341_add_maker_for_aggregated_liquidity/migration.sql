/*
  Warnings:

  - Added the required column `accountId` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AggregatedLiquidityByMarket" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
