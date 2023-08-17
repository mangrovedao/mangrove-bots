-- CreateTable
CREATE TABLE "TokenPrice" (
    "tokenAddress" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("tokenAddress","chainId","timestamp")
);

-- AddForeignKey
ALTER TABLE "TokenPrice" ADD CONSTRAINT "TokenPrice_tokenAddress_chainId_fkey" FOREIGN KEY ("tokenAddress", "chainId") REFERENCES "Token"("address", "chainId") ON DELETE RESTRICT ON UPDATE CASCADE;
