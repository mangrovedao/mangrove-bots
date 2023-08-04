import { Block } from "@prisma/client";

export type BlockWithoutId = Omit<Block, "id">;
