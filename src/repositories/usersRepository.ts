import { prismaClient } from '../db/dbConnection';
import { hashPassword } from '../helpers/hashHelper';
import { IUser } from '../interfaces/usersInterfaces';
import { User } from '../models/usersModel';

export class UsersRepository extends User {
    constructor(user: IUser) {
        super(user);
    }

    async getUserByEmail() {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    email: this.email,
                },
            });
            return user;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for a user in the database: \x1b[0m\n`,
                err
            );
            return false;
        }
    }

    async create() {
        try {
            const hash = await hashPassword(this.password);
            if (!hash) return false;

            const result = await prismaClient.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: hash,
                },
            });
            const { password, ...user } = result;
            return user;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save user to the database: \x1b[0m\n`,
                err
            );
            return false;
        }
    }
}
