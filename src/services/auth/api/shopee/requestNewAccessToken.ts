import axios, { AxiosResponse, isAxiosError } from "axios";
import { IResponseShopeeApiAccessToken } from "../../../../interfaces/accessTokenInterfaces";
import { generateSignature } from "./generateSignature";

export async function requestNewAccessToken(
    shopId: number,
    refreshToken: string,
): Promise<{ error: boolean; data: IResponseShopeeApiAccessToken }> {
    try {
        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_REFRESH_TOKEN_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);

        const baseString = partnerId + path + timestamp;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`;
        const encodeUrl = encodeURI(url);

        const response: AxiosResponse<IResponseShopeeApiAccessToken> =
            await axios.post(encodeUrl, {
                shop_id: shopId, // loja que vai conceder a autorizacao ao app
                refresh_token: refreshToken,
                partner_id: partnerId, // desenvolvedor do app
            });

        if (response.data.error || response.statusText !== "OK") {
            console.warn(
                `\x1b[1m\x1b[33m[ WARNING ]: \x1b[0m\n`,
                response.data,
            );
            return { error: true, data: response.data };
        }

        return { error: false, data: response.data };
    } catch (err: any) {
        if (isAxiosError(err)) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] Axios error getting Shopee access token. \x1b[0m\n`,
                err.response?.data || err.message,
            );
        }
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get the accessToken from the Shopee API. \x1b[0m\n`,
            err,
        );
        return { error: true, data: err };
    }
}
