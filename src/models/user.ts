import { IReqBody } from '../interfaces/user';

export class User {
    name: string;
    email: string;
    password: string;
    termsOfUse: string;

    constructor(reqBody: IReqBody) {
        this.name = reqBody.name;
        this.email = reqBody.email;
        this.password = reqBody.password;
        this.termsOfUse = reqBody.termsOfUse;
    }
}
