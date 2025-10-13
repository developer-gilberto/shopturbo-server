import { UserRepository } from "../src/domains/user/repositories/userRepository";
import { prismaClient } from "../src/infra/db/dbConnection";

async function createTestUser() {
    try {
        const userRepo = new UserRepository();

        const testUser = await userRepo.save({
            name: "fakeUser",
            email: "teste@shopturbo.com",
            password: "1234",
        });

        if (testUser.error || !testUser.data) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while executing the seed. Unable to save user in database :( \x1b[0m\n`,
            );
            return;
        }

        console.info(
            `\x1b[1m\x1b[32m-> User successfully saved in the database :) \x1b[0m\n`,
        );
        console.log(
            `🌱 USER -> id: ${testUser.data.id}, name: ${testUser.data.name}, email: ${testUser.data.email}`,
        );
    } catch (err) {
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while executing the seed :( \x1b[0m\n`,
        );
        console.error(err);
        return;
    } finally {
        await prismaClient.$disconnect();
    }
}

createTestUser();
