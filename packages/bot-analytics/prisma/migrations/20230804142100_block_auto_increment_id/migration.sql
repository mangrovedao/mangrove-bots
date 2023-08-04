-- AlterTable
CREATE SEQUENCE block_id_seq;
ALTER TABLE "Block" ALTER COLUMN "id" SET DEFAULT nextval('block_id_seq');
ALTER SEQUENCE block_id_seq OWNED BY "Block"."id";
