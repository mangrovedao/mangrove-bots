import waitPort from "wait-port";
import { exec, spawn } from "child_process";
import { PrismaClient } from "@prisma/client";
import { stdout } from "process";

const decoder = new TextDecoder("utf8");

export const startDb = async () => {
  const filePath = `${__dirname}/../../deploy/docker-compose.yml`;
  const childProcess = spawn(`docker-compose`, ["--file", filePath, "up"]);

  childProcess.stdout.on("data", (data) => {
    console.log(decoder.decode(data));
  });

  childProcess.stderr.on("data", (data) => {
    console.error(decoder.decode(data));
  });

  childProcess.on("close", (code) => {
    console.log(`docker-compose exited with code=${code}`);
  });

  await waitPort({
    port: 5432,
  });

  const url = `postgresql://postgres:postgres@localhost:5432/postgres?schema=mangrove`;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  try {
    await prisma.$executeRaw`DROP SCHEMA mangrove CASCADE`;
  } catch {}

  await new Promise<void>((resolve) => {
    exec("yarn prisma migrate dev", (error, stdout, stderr) => {
      console.error(error);
      console.error(stderr);
      console.log(stdout);

      resolve();
    });
  });

  return {
    prisma: prisma,
    stop: () => {
      childProcess.kill("SIGKILL");
      return new Promise<void>((resolve) => {
        exec(
          `docker-compose --file ${filePath} down`,
          (error, stdout, stderr) => {
            console.error(error);
            console.error(stderr);
            console.log(stdout);
            resolve();
          }
        );
      });
    },
  };
};

startDb();
