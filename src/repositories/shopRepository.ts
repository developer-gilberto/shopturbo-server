import { IShop } from '../interfaces/shopInterfaces';
import { prismaClient } from '../db/dbConnection';

export class ShopRepository {
    private readonly id: number;
    public name?: string;
    private readonly accessToken: string;
    private readonly refreshToken: string;
    private readonly expireIn: number;

    constructor(shop: IShop) {
        this.id = shop.shopId;
        this.name = shop.name;
        this.accessToken = shop.access_token;
        this.refreshToken = shop.refresh_token;
        this.expireIn = shop.expire_in;
    }

    async create() {
        try {
            return await prismaClient.shop.create({
                data: {
                    id: this.id,
                    name: this.name,
                    accessTokens: {
                        create: {
                            accessToken: this.accessToken,
                            refreshToken: this.refreshToken,
                            expireIn: this.expireIn,
                        },
                    },
                },
            });
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the shop to the database: \x1b[0m\n`,
                err
            );
            return null;
        }
    }
}
