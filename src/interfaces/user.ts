export interface IUser {
    name: string;
    email: string;
    password: string;
}

export interface IReqBody extends IUser {
    termsOfUse: string | boolean;
}
