/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AccountActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Chain` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE account_id_seq;
ALTER TABLE "Account" ALTER COLUMN "id" SET DEFAULT nextval('account_id_seq');
ALTER SEQUENCE account_id_seq OWNED BY "Account"."id";

-- AlterTable
CREATE SEQUENCE accountactivity_id_seq;
ALTER TABLE "AccountActivity" ALTER COLUMN "id" SET DEFAULT nextval('accountactivity_id_seq');
ALTER SEQUENCE accountactivity_id_seq OWNED BY "AccountActivity"."id";

-- AlterTable
CREATE SEQUENCE token_id_seq;
ALTER TABLE "Token" ALTER COLUMN "id" SET DEFAULT nextval('token_id_seq');
ALTER SEQUENCE token_id_seq OWNED BY "Token"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AccountActivity_id_key" ON "AccountActivity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chain_id_key" ON "Chain"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");
