import { ISaveShopParams } from "../interfaces/shopInterfaces";
import { prismaClient } from "../db/dbConnection";

export class ShopRepository {
    async save(shopData: ISaveShopParams) {
        try {
            const newShop = await prismaClient.shop.create({
                data: {
                    id: shopData.shopId,
                    userId: shopData.userId,
                    ShopeeAccessToken: {
                        create: {
                            accessToken: shopData.accessToken,
                            refreshToken: shopData.refreshToken,
                            expireIn: shopData.expireIn,
                        },
                    },
                },
            });
            return newShop;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the shop to the DB: \x1b[0m\n`,
                err,
            );
            return null;
        }
    }

    async getShopAndTokenByUserId(userId: number) {
        try {
            const shopAndToken = await prismaClient.shop.findFirst({
                where: {
                    userId: userId,
                },
                include: {
                    ShopeeAccessToken: true,
                },
            });
            return shopAndToken;
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for the ShopWithToken in the database: \x1b[0m\n`,
                err,
            );
            return false;
        }
    }
}
