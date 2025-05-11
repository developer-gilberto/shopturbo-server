import { prismaClient } from '../db/connection';
import { hashPassword } from '../helpers/hashHelper';
import { IReqBody } from '../interfaces/user';
import { User } from '../models/user';

export class UsersRepository extends User {
    constructor(user: IReqBody) {
        super(user);
    }

    async getEmail() {
        return await prismaClient.user.findUnique({
            where: {
                email: this.email,
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
