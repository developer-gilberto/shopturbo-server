export interface IAccessToken {
    shopId: number;
    refreshToken: string;
    accessToken: string;
    expireIn: number;
}

export interface IResponseShopeeApiAccessToken {
    request_id: string;
    error: string;
    message: string;
    shop_id?: number;
    refresh_token?: string;
    access_token?: string;
    expire_in?: number;
    merchant_id?: number;
    partner_id?: number;
}
