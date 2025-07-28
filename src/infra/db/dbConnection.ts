// import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
    log: ["info"],
});

async function connection() {
    try {
        await prismaClient.$connect();
        console.info(
            "\x1b[1m\x1b[32m-> Successful database connection :) \x1b[0m",
        );
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to connect to the database: \x1b[0m\n",
            err,
        );
    }
}

connection();
