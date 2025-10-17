import { AccessTokenRepository } from "../repositories/accessTokenRepository";
import * as tokenService from "./checksIfAccessTokenHasExpired";
import * as shopeeApiAuth from "../../../infra/integrations/shopee/auth/requestNewAccessToken";

export async function getValidAccessToken(shopId: number) {
    const tokenRepo = new AccessTokenRepository();

    const storedAccessToken = await tokenRepo.getTokenByShopId(shopId);

    if (storedAccessToken.error) {
        return { error: true, data: null };
    }

    const expiredToken = tokenService.checksIfTokenHasExpired(
        storedAccessToken.data?.expireIn!,
        // new Date("1999-12-31T00:00:00.000Z"), // <- teste token expirado
    );

    if (expiredToken) {
        const response = await shopeeApiAuth.requestNewShopeeApiAccessToken(
            storedAccessToken.data?.shopId!,
            storedAccessToken.data?.refreshToken!,
        );

        if (response.error) {
            return { error: true, data: null };
        }

        const newAccessToken = await tokenRepo.update({
            shopId: response.data.shop_id!,
            refreshToken: response.data.refresh_token!,
            accessToken: response.data.access_token!,
            expireIn: response.data.expire_in!,
        });

        if (newAccessToken.error) {
            return { error: true, data: null };
        }

        return { error: false, data: newAccessToken.data };
    }

    return { error: false, data: storedAccessToken.data };
}
