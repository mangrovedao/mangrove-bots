import { Block, PrismaClient } from "@prisma/client";
import { BlockWithoutId } from "./db/types";
import { Task } from "./types";
import logger from "./util/logger";

// const handleRange = async (
//   prisma: PrismaClient,
//   from: Block,
//   to: Block,
//   tasks: Task[]
// ) => {
//   logger.info(`handleRange`, {
//     from,
//     to,
//   });
//   await prisma.$transaction(
//     ...tasks.map((task) => task(prisma, from, to)),
//   );
// };
