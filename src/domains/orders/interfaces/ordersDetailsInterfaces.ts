import { Request } from 'express';

export interface IReqParams {
    shop_id: string;
}

export interface IReqQuery {
    order_id_list: string;
}

export type ExtendedReqOrderDetails = Request<
    Record<keyof IReqParams, string>,
    {},
    {},
    Record<keyof IReqQuery, string>
>;
