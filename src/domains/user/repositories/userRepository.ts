import { IUser } from "../interfaces/userInterfaces";
import { User as TUser, Prisma } from "@prisma/client";
import { prismaClient } from "../../../infra/db/dbConnection";
import { hashPassword } from "../../../infra/security/hashPassword";

type TUserWithShop = Prisma.UserGetPayload<{
    include: { Shop: true };
}>;

export class UserRepository {
    async getUserByEmail(
        email: string,
    ): Promise<{ error: boolean; data: TUser | null }> {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: email,
                },
            });

            return { error: false, data: user };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for a user in the database: \x1b[0m\n`,
                err,
            );

            return { error: true, data: null };
        }
    }

    async save(
        userData: IUser,
    ): Promise<{ error: boolean; data: Omit<TUser, "password"> | null }> {
        try {
            const hash = await hashPassword(userData.password);
            if (!hash) return { error: true, data: null };

            const result = await prismaClient.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: hash,
                },
            });
            const { password, ...user } = result;

            return { error: false, data: user };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save user to the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }

    async findUserWithShop(
        userId: number,
    ): Promise<{ error: boolean; data: TUserWithShop | null }> {
        try {
            const userAndShop = await prismaClient.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    Shop: true,
                },
            });

            return { error: false, data: userAndShop };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for the userShop in the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }
}
