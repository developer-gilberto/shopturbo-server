export interface IUser {
    name: string;
    email: string;
    password: string;
}

export interface IReqBody extends IUser {
    termsOfUse: string;
}

export interface IJwtPayload extends Partial<IUser> {
    id?: string;
    email: string;
}

import { Request } from 'express';
export type ExtendedRequest = Request & {
    loggedUser?: IJwtPayload;
};
