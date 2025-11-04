import { Request } from 'express';
import { IJwtPayload } from '../../user/interfaces/userInterfaces';

export interface IReqParams {
    shop_id: string;
    item_id: string;
}

export type ExtendedReq = Request<Record<keyof IReqParams, string>, {}> & {
    loggedUser?: IJwtPayload;
};

export interface IProduct {
    id: number;
    sku: string;
    categoryId: number;
    name: string;
    stock: number;
    sellingPrice: number;
    costPrice: number;
    governmentTaxes: number;
    imageUrl: string;
}

export interface IExtendedProduct extends IProduct {
    shopId: number;
}

export interface IProductsPagination {
    nextOffset: number | null;
    hasNextPage: boolean;
    totalProducts: number;
}
