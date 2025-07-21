import { Response } from "express";
import { ExtendedRequest } from "../../../../interfaces/usersInterfaces";
import { AccessTokenRepository } from "../../../../repositories/accessTokenRepository";
import { ShopRepository } from "../../../../repositories/shopRepository";
import { getAccessTokenSchema } from "../../../../schemas/getAccessTokenSchema";
import { calculateTokenExpirationDate } from "./calculateTokenExpirationDate";
import { requestAccessToken } from "./requestAccessToken";
import { requestNewAccessToken } from "./requestNewAccessToken";

export async function getAccessToken(req: ExtendedRequest, res: Response) {
    const safeData = getAccessTokenSchema().safeParse(req.query);

    if (!safeData.success) {
        res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
        return;
    }

    try {
        const accessTokenRepo = new AccessTokenRepository();

        const storedAccessToken = await accessTokenRepo.getAccessTokenByShopId(
            Number(req.query.shop_id),
        );

        if (storedAccessToken.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to search for the accessToken in the database.",
            });
            return;
        }

        if (!storedAccessToken.data) {
            const response = await requestAccessToken(
                safeData.data.code,
                Number(safeData.data.shop_id),
            );

            if (response.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to get the accessToken from the Shopee API. " +
                        response.data.message,
                });
                return;
            }

            const shopRepo = new ShopRepository();

            const newShop = await shopRepo.save({
                shopId: Number(safeData.data.shop_id),
                userId: Number(req.loggedUser!.id),
            });

            if (newShop.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to save the shop to the DB. ",
                });
                return;
            }

            const accessTokenData = await accessTokenRepo.save({
                shopId: Number(newShop.data!.id),
                refreshToken: response.data.refresh_token!,
                accessToken: response.data.access_token!,
                expireIn: response.data.expire_in!,
            });

            if (accessTokenData.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to save the accessToken to the database",
                });
                return;
            }

            res.status(200).json({
                error: false,
                message:
                    "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
                data: {
                    shopId: accessTokenData.data!.shopId,
                    accessToken: accessTokenData.data!.accessToken,
                    expiresAt: accessTokenData.data!.expireIn,
                },
            });
            return;
        }

        const tokenExpirationDate = storedAccessToken.data.expireIn;

        const now = new Date();
        const expiredToken = now > tokenExpirationDate;
        // const expiredToken = now > new Date("1999-01-01T00:44:59.614Z"); // <-- teste com token expirado

        if (expiredToken) {
            const response = await requestNewAccessToken(
                Number(safeData.data.shop_id),
                storedAccessToken.data.refreshToken,
            );

            if (response.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to get the newAccessToken from the Shopee API. " +
                        response.data.message,
                });
                return;
            }

            const accessTokenData = await accessTokenRepo.update({
                shopId: Number(safeData.data.shop_id),
                refreshToken: response.data.refresh_token!,
                accessToken: response.data.access_token!,
                expireIn: response.data.expire_in!,
            });

            if (accessTokenData.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to update the accessToken :(",
                });
                return;
            }

            res.status(200).json({
                error: false,
                message:
                    "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
                data: {
                    shopId: response.data.shop_id,
                    accessToken: accessTokenData.data!.accessToken,
                    expiresAt: accessTokenData.data!.expireIn,
                },
            });
            return;
        }

        res.status(200).json({
            error: false,
            message:
                "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
            data: {
                shopId: storedAccessToken.data.shopId,
                accessToken: storedAccessToken.data.accessToken,
                expiresAt: tokenExpirationDate,
            },
        });

        return;
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get the access_token: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message:
                "An error occurred while trying to get the access token from the Shopee API :(",
        });
    }
}
