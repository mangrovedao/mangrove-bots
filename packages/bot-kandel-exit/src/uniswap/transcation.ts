import { BigNumber, ethers } from "ethers";

export async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest,
  signer: ethers.Signer
): Promise<ethers.providers.TransactionReceipt> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  const txRes = await signer.sendTransaction(transaction);

  let receipt = null;
  const provider = signer.provider;
  if (!provider) {
    return null;
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  // Transaction was successful if status === 1
  return receipt;
}
