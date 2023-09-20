/*
  Warnings:

  - Changed the type of `sent0` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `received0` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalSent0` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalReceived0` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sent1` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `received1` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalSent1` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalReceived1` on the `AccountActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amountToken0` on the `AggregatedLiquidityByMarket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amountToken1` on the `AggregatedLiquidityByMarket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "sent0",
ADD COLUMN     "sent0" DECIMAL(65,30) NOT NULL,
DROP COLUMN "received0",
ADD COLUMN     "received0" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalSent0",
ADD COLUMN     "totalSent0" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalReceived0",
ADD COLUMN     "totalReceived0" DECIMAL(65,30) NOT NULL,
DROP COLUMN "sent1",
ADD COLUMN     "sent1" DECIMAL(65,30) NOT NULL,
DROP COLUMN "received1",
ADD COLUMN     "received1" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalSent1",
ADD COLUMN     "totalSent1" DECIMAL(65,30) NOT NULL,
DROP COLUMN "totalReceived1",
ADD COLUMN     "totalReceived1" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "AggregatedLiquidityByMarket" DROP COLUMN "amountToken0",
ADD COLUMN     "amountToken0" DECIMAL(65,30) NOT NULL,
DROP COLUMN "amountToken1",
ADD COLUMN     "amountToken1" DECIMAL(65,30) NOT NULL;
