/*
  Warnings:

  - The primary key for the `TokenPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timestamp` on the `TokenPrice` table. All the data in the column will be lost.
  - Added the required column `since` to the `TokenPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `until` to the `TokenPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenPrice" DROP CONSTRAINT "TokenPrice_pkey",
DROP COLUMN "timestamp",
ADD COLUMN     "since" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "until" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("tokenAddress", "chainId", "since", "until");
