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
