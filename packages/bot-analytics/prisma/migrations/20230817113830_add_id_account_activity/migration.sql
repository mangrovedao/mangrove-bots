/*
  Warnings:

  - The primary key for the `AccountActivity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AccountActivity` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AccountActivity_id_key";

-- AlterTable
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AccountActivity_pkey" PRIMARY KEY ("fromBlockChainId", "fromBlockNumber", "toBlockNumber", "token0Address", "token1Address", "accountId", "asMaker");
