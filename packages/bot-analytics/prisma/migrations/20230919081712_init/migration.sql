-- CreateTable
CREATE TABLE "Chain" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "number" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("number","chainId")
);

-- CreateTable
CREATE TABLE "Token" (
    "address" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("address","chainId")
);

-- CreateTable
CREATE TABLE "TokenPrice" (
    "tokenAddress" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "since" TIMESTAMP(3) NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("tokenAddress","chainId","since","until")
);

-- CreateTable
CREATE TABLE "Account" (
    "address" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "AccountActivity" (
    "fromBlockChainId" INTEGER NOT NULL,
    "fromBlockNumber" INTEGER NOT NULL,
    "toBlockChainId" INTEGER NOT NULL,
    "toBlockNumber" INTEGER NOT NULL,
    "token0ChainId" INTEGER NOT NULL,
    "token0Address" TEXT NOT NULL,
    "token1ChainId" INTEGER NOT NULL,
    "token1Address" TEXT NOT NULL,
    "sent0" TEXT NOT NULL,
    "received0" TEXT NOT NULL,
    "totalSent0" TEXT NOT NULL,
    "totalReceived0" TEXT NOT NULL,
    "sent1" TEXT NOT NULL,
    "received1" TEXT NOT NULL,
    "totalSent1" TEXT NOT NULL,
    "totalReceived1" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "asMaker" BOOLEAN NOT NULL,

    CONSTRAINT "AccountActivity_pkey" PRIMARY KEY ("fromBlockChainId","fromBlockNumber","toBlockNumber","token0Address","token1Address","accountId","asMaker")
);

-- CreateTable
CREATE TABLE "AggregatedLiquidityByMarket" (
    "fromBlockChainId" INTEGER NOT NULL,
    "fromBlockNumber" INTEGER NOT NULL,
    "toBlockChainId" INTEGER NOT NULL,
    "toBlockNumber" INTEGER NOT NULL,
    "token0ChainId" INTEGER NOT NULL,
    "token0Address" TEXT NOT NULL,
    "token1ChainId" INTEGER NOT NULL,
    "token1Address" TEXT NOT NULL,
    "amountToken0" TEXT NOT NULL,
    "amountToken1" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "AggregatedLiquidityByMarket_pkey" PRIMARY KEY ("fromBlockChainId","fromBlockNumber","toBlockNumber","token0Address","token1Address","accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_id_key" ON "Chain"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenPrice" ADD CONSTRAINT "TokenPrice_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "Token"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_fromBlockChainId_fromBlockNumber_fkey" FOREIGN KEY ("fromBlockChainId", "fromBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_toBlockChainId_toBlockNumber_fkey" FOREIGN KEY ("toBlockChainId", "toBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token0ChainId_token0Address_fkey" FOREIGN KEY ("token0ChainId", "token0Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_token1ChainId_token1Address_fkey" FOREIGN KEY ("token1ChainId", "token1Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountActivity" ADD CONSTRAINT "AccountActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_fromBlockChainId_fromBlockNumb_fkey" FOREIGN KEY ("fromBlockChainId", "fromBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_toBlockChainId_toBlockNumber_fkey" FOREIGN KEY ("toBlockChainId", "toBlockNumber") REFERENCES "Block"("chainId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token0ChainId_token0Address_fkey" FOREIGN KEY ("token0ChainId", "token0Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_token1ChainId_token1Address_fkey" FOREIGN KEY ("token1ChainId", "token1Address") REFERENCES "Token"("chainId", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedLiquidityByMarket" ADD CONSTRAINT "AggregatedLiquidityByMarket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
