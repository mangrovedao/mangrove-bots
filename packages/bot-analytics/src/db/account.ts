import moize from "moize";
import { PrismaTx } from "./types";

export const getOrCreateAccount = moize(
  async (prisma: PrismaTx, _address: string) => {
    return prisma.account.upsert({
      where: {
        address: _address,
      },
      update: {},
      create: {
        address: _address,
      },
    });
  }
);
