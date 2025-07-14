import { ISaveShopParams } from "../interfaces/shopInterfaces";
import { prismaClient } from "../db/dbConnection";
import { Shop as TShop } from "@prisma/client";
import type { Prisma } from "@prisma/client";

type TShopWithToken = Prisma.ShopGetPayload<{
    include: { ShopeeAccessToken: true };
}>;

export class ShopRepository {
    async saveShopWithAccessToken(
        shopData: ISaveShopParams,
    ): Promise<{ error: boolean; data: TShop | null }> {
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
            return { error: false, data: newShop };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the shop to the DB: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }

    async getShopAndTokenByUserId(userId: number): Promise<{
        error: boolean;
        data: TShopWithToken | null;
    }> {
        try {
            const shopAndToken = await prismaClient.shop.findFirst({
                where: {
                    userId: userId,
                },
                include: {
                    ShopeeAccessToken: true,
                },
            });

            return { error: false, data: shopAndToken };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to search for the ShopWithToken in the database: \x1b[0m\n`,
                err,
            );
            return { error: true, data: null };
        }
    }
}
