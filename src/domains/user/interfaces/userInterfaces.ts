export interface IUser {
    name: string;
    email: string;
    password: string;
}

export interface IRequestBody extends IUser {
    termsOfUse: string;
}

export interface IJwtPayload extends Partial<IUser> {
    id: number;
    email: string;
}

import { Request } from "express";
export type ExtendedRequest = Request & {
    loggedUser?: IJwtPayload;
};
