import { PrismaClient } from "@prisma/client";
import { startDb } from "../helpers/start-db";

describe("Volume tracking", () => {
  let prisma: PrismaClient | undefined;
  let stop: () => Promise<void> | undefined;
  before(async () => {
    const result = await startDb();

    prisma = result.prisma;
    stop = result.stop;
  });

  it("test", () => {
    console.log("hellow world");
  });

  after(async () => {
    await stop();
  });
});
