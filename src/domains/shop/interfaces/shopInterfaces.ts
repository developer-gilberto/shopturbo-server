import { IJwtPayload } from "../../user/interfaces/userInterfaces";

export interface IShop {
    shopName: string;
    loggedUser: {
        id: number;
        name?: string;
        email?: string;
    };
    access_token: string;
    refresh_token: string;
    expire_in: number;
}

export interface ISaveShopParams {
    userId: number;
    shopId: number;
    accessToken: string;
    refreshToken: string;
    expireIn: number;
}

export interface IShopInfo {
    shopId: number;
    accessToken: string;
    shopOwner: IJwtPayload;
}

export interface IResponseGetShopProfile {
    message: string;
    request_id: string;
    response: {
        shop_logo: string;
        description: string;
        shop_name: string;
        invoice_issuer: string;
    };
    error: string;
}
