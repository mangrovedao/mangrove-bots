/*
  Warnings:

  - Added the required column `asMaker` to the `AccountActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountActivity" ADD COLUMN     "asMaker" BOOLEAN NOT NULL;
