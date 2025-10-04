import { Request, Response } from "express";
import { updateAccessTokenSchema } from "../schemas/updateTokenSchema";
import * as shopeeApiAuth from "../../../infra/integrations/shopee/auth";
import { AccessTokenRepository } from "../repositories/accessTokenRepository";

export async function updateAccessToken(req: Request, res: Response) {
    const safeData = updateAccessTokenSchema().safeParse(req.body);

    if (!safeData.success) {
        res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
        return;
    }

    const response = await shopeeApiAuth.requestNewShopeeApiAccessToken(
        Number(safeData.data.shopId),
        safeData.data.refreshToken,
    );

    if (response.error) {
        res.status(500).json({
            error: true,
            message: response.data.message,
        });
        return;
    }

    const tokenRepo = new AccessTokenRepository();

    const newAccessToken = await tokenRepo.update({
        shopId: Number(safeData.data.shopId),
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

    res.cookie("accessToken", newAccessToken.data!.accessToken, {
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
            "The token was successfully refreshed and saved to cookies. Send cookies on all API requests by setting 'credentials: include' on your frontend.",
    });
    return;
}
