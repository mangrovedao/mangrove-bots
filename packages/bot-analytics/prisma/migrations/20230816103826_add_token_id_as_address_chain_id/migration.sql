/*
  Warnings:

  - You are about to drop the column `token0Id` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token1Id` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `token0Id` on the `AggregatedLiquidityByMarket` table. All the data in the column will be lost.
  - You are about to drop the column `token1Id` on the `AggregatedLiquidityByMarket` table. All the data in the column will be lost.
  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Token` table. All the data in the column will be lost.
  - Added the required column `token0Address` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token0ChainId` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Address` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1ChainId` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token0Address` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token0ChainId` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Address` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1ChainId` to the `AggregatedLiquidityByMarket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_token0Id_fkey";

-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_token1Id_fkey";

-- DropForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" DROP CONSTRAINT "AggregatedLiquidityByMarket_token0Id_fkey";

-- DropForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" DROP CONSTRAINT "AggregatedLiquidityByMarket_token1Id_fkey";

-- DropIndex
DROP INDEX "Token_id_key";

-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "token0Id",
DROP COLUMN "token1Id",
ADD COLUMN     "token0Address" TEXT NOT NULL,
ADD COLUMN     "token0ChainId" INTEGER NOT NULL,
ADD COLUMN     "token1Address" TEXT NOT NULL,
ADD COLUMN     "token1ChainId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AggregatedLiquidityByMarket" DROP COLUMN "token0Id",
DROP COLUMN "token1Id",
ADD COLUMN     "token0Address" TEXT NOT NULL,
ADD COLUMN     "token0ChainId" INTEGER NOT NULL,
ADD COLUMN     "token1Address" TEXT NOT NULL,
ADD COLUMN     "token1ChainId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Token" DROP CONSTRAINT "Token_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("address", "chainId");

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token0ChainId_token0Address_fkey" FOREIGN KEY ("token0ChainId", "token0Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token1ChainId_token1Address_fkey" FOREIGN KEY ("token1ChainId", "token1Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token0ChainId_token0Address_fkey" FOREIGN KEY ("token0ChainId", "token0Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token1ChainId_token1Address_fkey" FOREIGN KEY ("token1ChainId", "token1Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;
