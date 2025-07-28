import type { Prisma, Shop as TShop } from "@prisma/client";
import { prismaClient } from "../../../infra/db/dbConnection";
import { ISaveShopParams } from "../interfaces/shopInterfaces";
import { calculateTokenExpirationDate } from "../../accessToken/services/calculateTokenExpirationDate";

type TShopWithToken = Prisma.ShopGetPayload<{
    include: { ShopeeAccessToken: true };
}>;

export class ShopRepository {
    async save(
        shopId: number,
        userId: number,
    ): Promise<{ error: boolean; data: TShop | null }> {
        try {
            const newShop = await prismaClient.shop.create({
                data: {
                    id: shopId,
                    user: {
                        connect: {
                            id: userId,
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

    async saveShopWithAccessToken(
        shopData: ISaveShopParams,
    ): Promise<{ error: boolean; data: TShopWithToken | null }> {
        try {
            const expiresDate = calculateTokenExpirationDate(
                Date.now(),
                shopData.expireIn,
            );

            const newShop = await prismaClient.shop.create({
                data: {
                    id: shopData.shopId,
                    userId: shopData.userId,
                    ShopeeAccessToken: {
                        create: {
                            accessToken: shopData.accessToken,
                            refreshToken: shopData.refreshToken,
                            expireIn: expiresDate,
                        },
                    },
                },
                include: {
                    ShopeeAccessToken: true,
                },
            });

            return { error: false, data: newShop };
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the shop with accessToken to the DB: \x1b[0m\n`,
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
