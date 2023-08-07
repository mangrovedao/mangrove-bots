/*
  Warnings:

  - You are about to drop the column `received` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `totalReceived` on the `AccountActivity` table. All the data in the column will be lost.
  - You are about to drop the column `totalSent` on the `AccountActivity` table. All the data in the column will be lost.
  - Added the required column `received0` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `received1` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sent0` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sent1` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token0Id` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Id` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceived0` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceived1` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSent0` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSent1` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_tokenId_fkey";

-- AlterTable
ALTER TABLE "AccountActivity" DROP COLUMN "received",
DROP COLUMN "sent",
DROP COLUMN "tokenId",
DROP COLUMN "totalReceived",
DROP COLUMN "totalSent",
ADD COLUMN     "received0" TEXT NOT NULL,
ADD COLUMN     "received1" TEXT NOT NULL,
ADD COLUMN     "sent0" TEXT NOT NULL,
ADD COLUMN     "sent1" TEXT NOT NULL,
ADD COLUMN     "token0Id" INTEGER NOT NULL,
ADD COLUMN     "token1Id" INTEGER NOT NULL,
ADD COLUMN     "totalReceived0" TEXT NOT NULL,
ADD COLUMN     "totalReceived1" TEXT NOT NULL,
ADD COLUMN     "totalSent0" TEXT NOT NULL,
ADD COLUMN     "totalSent1" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
