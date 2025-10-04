import { Response } from "express";
import * as tokenService from "../services";
import { ExtendedRequest } from "../../user/interfaces/userInterfaces";
import { ShopRepository } from "../../shop/repositories/shopRepository";
import * as shopeeApiAuth from "../../../infra/integrations/shopee/auth";
import { AccessTokenRepository } from "../repositories/accessTokenRepository";
import { getAccessTokenSchema } from "../../accessToken/schemas/getTokenSchema";

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
        const tokenRepo = new AccessTokenRepository();

        const storedToken = await tokenRepo.getTokenByShopId(
            Number(safeData.data.shop_id),
        );

        if (storedToken.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to search for the accessToken in the database.",
            });
            return;
        }

        if (!storedToken.data) {
            const response = await shopeeApiAuth.requestShopeeApiAccessToken(
                safeData.data.code, // válido por 10 minutos
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

            const newShop = await shopRepo.save(
                Number(safeData.data.shop_id),
                Number(req.loggedUser!.id),
            );

            if (newShop.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to save the shop to the DB. ",
                });
                return;
            }

            const accessTokenData = await tokenRepo.save({
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

            res.cookie("accessToken", accessTokenData.data!.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "none",
                path: "/",
                expires: accessTokenData.data!.expireIn,
            });

            res.cookie("shopId", accessTokenData.data!.shopId, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "none",
                path: "/",
                expires: accessTokenData.data!.expireIn,
            });

            res.status(200).json({
                error: false,
                message:
                    "The token was successfully obtained and saved in cookies. Send cookies in all API requests by setting the 'credentials: include' in your frontend.",
            });
            return;
        }

        const expiredToken = tokenService.checksIfTokenHasExpired(
            storedToken.data.expireIn,
            // new Date("1999-12-31T00:00:00.000Z"),// <- teste token expirado
        );

        if (expiredToken) {
            const response = await shopeeApiAuth.requestNewShopeeApiAccessToken(
                Number(safeData.data.shop_id),
                storedToken.data.refreshToken,
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

            const newAccessToken = await tokenRepo.update({
                shopId: Number(safeData.data.shop_id),
                refreshToken: response.data.refresh_token!,
                accessToken: response.data.access_token!,
                expireIn: response.data.expire_in!,
            });

            if (newAccessToken.error) {
                res.status(500).json({
                    error: true,
                    message:
                        "An error occurred while trying to update the accessToken :(",
                });
                return;
            }

            res.cookie("accessToken", newAccessToken.data?.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "none",
                path: "/",
                expires: newAccessToken.data!.expireIn,
            });

            res.cookie("shopId", newAccessToken.data!.shopId, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "none",
                path: "/",
                expires: newAccessToken.data!.expireIn,
            });

            res.status(200).json({
                error: false,
                message:
                    "The token was successfully obtained and saved in cookies. Send cookies in all API requests by setting the 'credentials: include' in your frontend.",
            });
            return;
        }

        res.status(200).json({
            error: false,
            message:
                "The token was successfully obtained and saved in cookies. Send cookies in all API requests by setting the 'credentials: include' in your frontend.",
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
        return;
    }
}
