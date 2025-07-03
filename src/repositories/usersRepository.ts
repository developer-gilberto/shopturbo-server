import { prismaClient } from "../db/dbConnection";
import { hashPassword } from "../helpers/hashHelper";
import { IUser } from "../interfaces/usersInterfaces";

export class UsersRepository {
    async getUserByEmail(email: string) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: email,
                },
            });
            return user;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for a user in the database: \x1b[0m\n`,
                err,
            );
            return false;
        }
    }

    async save(userData: IUser) {
        try {
            const hash = await hashPassword(userData.password);
            if (!hash) return false;

            const result = await prismaClient.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hash,
                },
            });
            const { password, ...user } = result;
            return user;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save user to the database: \x1b[0m\n`,
                err,
            );
            return false;
        }
    }

    async findUserWithShop(userId: number) {
        try {
            return await prismaClient.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    Shop: true,
                },
            });
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for the userShop in the database: \x1b[0m\n`,
                err,
            );
            return false;
        }
    }
}
