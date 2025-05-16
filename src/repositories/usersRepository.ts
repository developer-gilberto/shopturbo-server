import { prismaClient } from '../db/dbConnection';
import { hashPassword } from '../helpers/hashHelper';
import { IUser } from '../interfaces/usersInterfaces';
import { User } from '../models/usersModel';

export class UsersRepository extends User {
    constructor(user: IUser) {
        super(user);
    }

    async getUserByEmail() {
        return await prismaClient.user.findUnique({
            where: {
                email: this.email,
            },
        });
    }

    async getPassword() {
        return await prismaClient.user.findUnique({
            where: {
                email: this.email,
            },
            select: {
                password: true,
            },
        });
    }

    async create() {
        const result = await prismaClient.user.create({
            data: {
                name: this.name,
                email: this.email,
                password: await hashPassword(this.password),
            },
        });
        const { password, ...user } = result;
        return user;
    }
}
