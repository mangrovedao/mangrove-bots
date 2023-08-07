/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AccountActivity" DROP CONSTRAINT "AccountActivity_accountId_fkey";

-- DropIndex
DROP INDEX "Account_id_key";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("address");

-- AlterTable
ALTER TABLE "AccountActivity" ALTER COLUMN "accountId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
