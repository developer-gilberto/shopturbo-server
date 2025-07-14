import { Response } from "express";
import { ShopRepository } from "../../../../repositories/shopRepository";
import { ExtendedRequest } from "../../../../interfaces/usersInterfaces";
import { AccessTokenRepository } from "../../../../repositories/accessTokenRepository";
import { requestAccessToken } from "./requestAccessToken";
import { requestNewAccessToken } from "./requestNewAccessToken";
import { getAccessTokenSchema } from "../../../../schemas/getAccessTokenSchema";

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
        const shopRepo = new ShopRepository();
        const storedShop = await shopRepo.getShopAndTokenByUserId(
            Number(req.loggedUser!.id),
        );

        if (storedShop.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to search for the ShopWithToken in the database.",
            });
            return;
        }

        if (!storedShop.data) {
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

            const shopSaveResult = await shopRepo.saveShopWithAccessToken({
                shopId: Number(safeData.data.shop_id),
                userId: req.loggedUser!.id,
                accessToken: response.data.access_token!,
                refreshToken: response.data.refresh_token!,
                expireIn: response.data.expire_in!,
            });

            if (shopSaveResult.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to save the shop to the database",
                });
                return;
            }

            const tokenExpirationDate = new Date(
                shopSaveResult.data!.updatedAt.getTime() +
                    response.data.expire_in! * 1000,
            );

            res.status(200).json({
                error: false,
                message:
                    "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
                data: {
                    shopId: response.data.shop_id,
                    accessToken: response.data.access_token,
                    expiresAt: tokenExpirationDate,
                },
            });
            return;
        }

        const tokenExpirationDate = new Date(
            storedShop.data.ShopeeAccessToken!.updatedAt.getTime() +
                storedShop.data.ShopeeAccessToken!.expireIn * 1000,
        );

        const now = new Date();
        const expiredToken = now > tokenExpirationDate;
        // const expiredToken = now > new Date("2021-01-01T00:44:59.614Z"); // <- teste com token expirado

        if (expiredToken) {
            const response = await requestNewAccessToken(
                Number(safeData.data.shop_id),
                storedShop.data.ShopeeAccessToken!.refreshToken,
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

            const accessTokenRepo = new AccessTokenRepository();

            const accessTokenUpdateResult = await accessTokenRepo.update({
                shopId: Number(safeData.data.shop_id),
                refresh_token: response.data.refresh_token!,
                access_token: response.data.access_token!,
                expire_in: response.data.expire_in!,
            });

            if (accessTokenUpdateResult.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to update the accessToken :(",
                });
                return;
            }

            const tokenExpireIn = new Date(
                accessTokenUpdateResult.data!.updatedAt.getTime() +
                    response.data.expire_in! * 1000,
            );
            res.status(200).json({
                error: false,
                message:
                    "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
                data: {
                    shopId: response.data.shop_id,
                    accessToken: accessTokenUpdateResult.data!.accessToken,
                    expiresAt: tokenExpireIn,
                },
            });
            return;
        }

        res.status(200).json({
            error: false,
            message:
                "The access token expires in 4 hours and can be used multiple times. If you do not use shopTurbo for more than 30 days, you will need to connect to the Shopee API again to grant authorization to shopTurbo again.",
            data: {
                shopId: storedShop.data.ShopeeAccessToken!.shopId,
                accessToken: storedShop.data.ShopeeAccessToken!.accessToken,
                expiresAt: tokenExpirationDate,
            },
        });
        return;
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to get the access_token: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message:
                "an error occurred while trying to get the access token :(",
        });
    }
}
