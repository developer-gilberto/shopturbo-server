export interface IShop {
    shopName: string;
    // userId: number;
    // userName?: string;
    // userEmail?: string;
    loggedUser: {
        id: number;
        name?: string;
        email?: string;
    };
    access_token: string;
    refresh_token: string;
    expire_in: number;
}
