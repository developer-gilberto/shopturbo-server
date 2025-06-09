import { prismaClient } from '../db/dbConnection';

export interface IAccessToken {
    shopId: number;
    refresh_token: string;
    access_token: string;
    expire_in: number;
}

export class AccessTokenRepository {
    private readonly shopId: number;
    private readonly refreshToken: string;
    private readonly accessToken: string;
    private readonly expireIn: number;

    constructor(data: IAccessToken) {
        this.shopId = data.shopId;
        this.refreshToken = data.refresh_token;
        this.accessToken = data.access_token;
        this.expireIn = data.expire_in;
    }

    async save() {
        try {
            return await prismaClient.accessToken.create({
                data: {
                    shopId: this.shopId,
                    refreshToken: this.refreshToken,
                    accessToken: this.accessToken,
                    expireIn: this.expireIn,
                },
            });
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the accessToken to the database: \x1b[0m\n`,
                err
            );
            return null;
        }
    }
}
