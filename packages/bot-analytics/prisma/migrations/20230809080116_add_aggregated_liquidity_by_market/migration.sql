-- CreateTable
CREATE TABLE "AggregatedLiquidityByMarket" (
    "id" SERIAL NOT NULL,
    "fromBlockId" INTEGER NOT NULL,
    "toBlockId" INTEGER NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "amountToken0" TEXT NOT NULL,
    "amountToken1" TEXT NOT NULL,

    CONSTRAINT "AggregatedLiquidityByMarket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AggregatedLiquidityByMarket_id_key" ON "AggregatedLiquidityByMarket"("id");

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_fromBlockId_fkey" FOREIGN KEY ("fromBlockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_toBlockId_fkey" FOREIGN KEY ("toBlockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
