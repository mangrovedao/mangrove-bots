/*
  Warnings:

  - You are about to drop the column `fromBlockId` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `toBlockId` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `fromBlockId` on the `AggregatedLiquidityByMarket` table. All the data in the column will be lost.
  - You are about to drop the column `toBlockId` on the `AggregatedLiquidityByMarket` table. All the data in the column will be lost.
  - The primary key for the `Block` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Block` table. All the data in the column will be lost.
  - Added the required column `fromBlockChainId` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromBlockNumber` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBlockChainId` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBlockNumber` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromBlockChainId` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromBlockNumber` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBlockChainId` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toBlockNumber` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_fromBlockId_fkey";

-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_toBlockId_fkey";

-- DropForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" DROP CONSTRAINT "AggregatedLiquidityByMarket_fromBlockId_fkey";

-- DropForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" DROP CONSTRAINT "AggregatedLiquidityByMarket_toBlockId_fkey";

-- DropIndex
DROP INDEX "Block_id_key";

-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "fromBlockId",
DROP COLUMN "toBlockId",
ADD COLUMN     "fromBlockChainId" INTEGER NOT NULL,
ADD COLUMN     "fromBlockNumber" INTEGER NOT NULL,
ADD COLUMN     "toBlockChainId" INTEGER NOT NULL,
ADD COLUMN     "toBlockNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AggregatedLiquidityByMarket" DROP COLUMN "fromBlockId",
DROP COLUMN "toBlockId",
ADD COLUMN     "fromBlockChainId" INTEGER NOT NULL,
ADD COLUMN     "fromBlockNumber" INTEGER NOT NULL,
ADD COLUMN     "toBlockChainId" INTEGER NOT NULL,
ADD COLUMN     "toBlockNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Block" DROP CONSTRAINT "Block_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Block_pkey" PRIMARY KEY ("number", "chainId");

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_fromBlockChainId_fromBlockNumber_fkey" FOREIGN KEY ("fromBlockChainId", "fromBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_toBlockChainId_toBlockNumber_fkey" FOREIGN KEY ("toBlockChainId", "toBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_fromBlockChainId_fromBlockNumb_fkey" FOREIGN KEY ("fromBlockChainId", "fromBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_toBlockChainId_toBlockNumber_fkey" FOREIGN KEY ("toBlockChainId", "toBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;
