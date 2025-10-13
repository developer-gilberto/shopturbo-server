import { prismaClient } from "../src/infra/db/dbConnection";

async function resetSeed() {
    try {
        await prismaClient.user.deleteMany({
            where: { email: "teste@shopturbo.com" },
        });

        console.info(
            `\x1b[1m\x1b[32m-> User successfully deleted from database :) \x1b[0m\n`,
        );
    } catch (err) {
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while reset the seed :( \x1b[0m\n`,
        );
        console.error(err);
        return;
    } finally {
        await prismaClient.$disconnect();
    }
}

resetSeed();
