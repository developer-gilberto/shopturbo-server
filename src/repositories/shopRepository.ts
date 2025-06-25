import { IShop } from "../interfaces/shopInterfaces";
import { prismaClient } from "../db/dbConnection";

export class ShopRepository {
    public shopName?: string;
    private readonly loggedUserId: number;
    private readonly accessToken: string;
    private readonly refreshToken: string;
    private readonly expireIn: number;

    constructor(data: IShop) {
        this.shopName = data.shopName;
        this.loggedUserId = data.loggedUser.id;
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.expireIn = data.expire_in;
    }

    async save() {
        try {
            return await prismaClient.shop.create({
                data: {
                    name: this.shopName,
                    user: {
                        connect: {
                            id: this.loggedUserId,
                        },
                    },
                    ShopeeAccessToken: {
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
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the shop to the DB: \x1b[0m\n`,
                err,
            );
            return null;
        }
    }
}
