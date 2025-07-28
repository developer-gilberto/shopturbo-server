import { prismaClient } from "../../../infra/db/dbConnection";
import { IAccessToken } from "../interfaces/accessTokenInterfaces";
import { ShopeeAccessToken as TShopeeAccessToken } from "@prisma/client";
import { calculateTokenExpirationDate } from "../services/calculateTokenExpirationDate";

export class AccessTokenRepository {
    async getTokenByShopId(
        shopId: number,
    ): Promise<{ error: boolean; data: TShopeeAccessToken | null }> {
        try {
            const accessToken = await prismaClient.shopeeAccessToken.findUnique(
                {
                    where: { shopId: shopId },
                },
            );

            return { error: false, data: accessToken };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get the accessToken to the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }

    async save(
        data: IAccessToken,
    ): Promise<{ error: boolean; data: TShopeeAccessToken | null }> {
        try {
            const expiresDate = calculateTokenExpirationDate(
                Date.now(),
                data.expireIn,
            );

            const accessTokenData = await prismaClient.shopeeAccessToken.create(
                {
                    data: {
                        shopId: data.shopId,
                        refreshToken: data.refreshToken,
                        accessToken: data.accessToken,
                        expireIn: expiresDate,
                    },
                },
            );

            return { error: false, data: accessTokenData };
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
            const expiresDate = calculateTokenExpirationDate(
                Date.now(),
                data.expireIn,
            );
            const result = await prismaClient.shopeeAccessToken.update({
                where: {
                    shopId: data.shopId,
                },
                data: {
                    refreshToken: data.refreshToken,
                    accessToken: data.accessToken,
                    expireIn: expiresDate,
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
