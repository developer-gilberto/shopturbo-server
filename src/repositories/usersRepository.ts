import { prismaClient } from '../db/connection';
import { hashPassword } from '../helpers/hashHelper';
import { IUser } from '../interfaces/user';

// export class UsersRepository extends User {
//     constructor(user: IReqBody) {
//         super(user);
//     }
export class UsersRepository {
    name: string;
    email: string;
    password: string;

    constructor(user: IUser) {
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
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
