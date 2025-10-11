import { Request } from 'express';
import { IJwtPayload } from '../../user/interfaces/userInterfaces';

export interface IReqParams {
    shop_id: string;
    item_id: string;
}

export type ExtendedReq = Request<Record<keyof IReqParams, string>, {}> & {
    loggedUser?: IJwtPayload;
};
