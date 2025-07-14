import { ShopeeAccessToken as TShopeeAccessToken } from "@prisma/client";
import { prismaClient } from "../db/dbConnection";
import { IAccessToken } from "../interfaces/accessTokenInterfaces";

export class AccessTokenRepository {
    async save(
        data: IAccessToken,
    ): Promise<{ error: boolean; data: TShopeeAccessToken | null }> {
        try {
            const result = await prismaClient.shopeeAccessToken.create({
                data: {
                    shopId: data.shopId,
                    refreshToken: data.refresh_token,
                    accessToken: data.access_token,
                    expireIn: data.expire_in,
                },
            });
            return { error: false, data: result };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the accessToken to the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }

    async update(
        data: IAccessToken,
    ): Promise<{ error: boolean; data: TShopeeAccessToken | null }> {
        try {
            const result = await prismaClient.shopeeAccessToken.update({
                where: {
                    shopId: data.shopId,
                },
                data: {
                    refreshToken: data.refresh_token,
                    accessToken: data.access_token,
                    expireIn: data.expire_in,
                },
            });
            return { error: false, data: result };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to update the accessToken to the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }
}
