import { IUser } from '../interfaces/usersInterfaces';

export class User {
    protected name: string;
    protected email: string;
    protected password: string;

    constructor(userData: IUser) {
        this.name = userData.name;
        this.email = userData.email;
        this.password = userData.password;
    }
}
