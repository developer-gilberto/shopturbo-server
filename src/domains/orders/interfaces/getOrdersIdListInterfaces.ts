import { Request } from "express";

export interface IReqParams {
    shop_id: string;
    item_id: string;
}

export interface IReqQuery {
    time_range_field: string;
    interval_days: string;
    page_size: string;
    order_status: string;
}

export type ExtendedReqOrder = Request<
    Record<keyof IReqParams, string>,
    {},
    {},
    Record<keyof IReqQuery, string>
>;
