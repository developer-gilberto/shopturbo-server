import { IUser } from '../interfaces/usersInterfaces';

export class User {
    protected name: string;
    protected email: string;
    protected password: string;

    constructor(reqBody: IUser) {
        this.name = reqBody.name;
        this.email = reqBody.email;
        this.password = reqBody.password;
    }
}
