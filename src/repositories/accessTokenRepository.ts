import { prismaClient } from "../db/dbConnection";
import { IAccessToken } from "../interfaces/accessTokenInterfaces";

export class AccessTokenRepository {
    async save(data: IAccessToken) {
        try {
            return await prismaClient.shopeeAccessToken.create({
                data: {
                    shopId: data.shopId,
                    refreshToken: data.refresh_token,
                    accessToken: data.access_token,
                    expireIn: data.expire_in,
                },
            });
        } catch (err) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to save the accessToken to the database: \x1b[0m\n`,
                err,
            );
            return null;
        }
    }
}
