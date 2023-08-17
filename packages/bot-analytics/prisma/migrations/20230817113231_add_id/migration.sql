/*
  Warnings:

  - The primary key for the `AggregatedLiquidityByMarket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AggregatedLiquidityByMarket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AggregatedLiquidityByMarket_id_key";

-- AlterTable
ALTER TABLE "AggregatedLiquidityByMarket" DROP CONSTRAINT "AggregatedLiquidityByMarket_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AggregatedLiquidityByMarket_pkey" PRIMARY KEY ("fromBlockChainId", "fromBlockNumber", "toBlockNumber", "token0Address", "token1Address", "accountId");
