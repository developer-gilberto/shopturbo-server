import { generateSignature } from "./generateSignature";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { IResponseShopeeApiAccessToken } from "../../../../domains/accessToken/interfaces/accessTokenInterfaces";

export async function requestShopeeApiAccessToken(
    code: string,
    shopId: number,
): Promise<{ error: boolean; data: IResponseShopeeApiAccessToken }> {
    try {
        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ACCESS_TOKEN_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);

        const baseString = partnerId + path + timestamp;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`;
        const encodeUrl = encodeURI(url);

        const response: AxiosResponse<IResponseShopeeApiAccessToken> =
            await axios.post(encodeUrl, {
                code: code,
                shop_id: shopId, // loja que vai conceder a autorizacao ao app
                partner_id: Number(partnerId), // desenvolvedor do app
            });

        if (response.data.error || response.statusText !== "OK") {
            return {
                error: true,
                data: response.data,
            };
        }

        return { error: false, data: response.data };
    } catch (err: any) {
        if (isAxiosError(err)) {
            console.error(
                `\x1b[1m\x1b[31m[ ERROR ] Axios error getting Shopee access token. \x1b[0m\n`,
                err.message,
            );
            console.error(err.response?.data);
        }
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get the accessToken from the Shopee API. \x1b[0m\n`,
            err,
        );
        return { error: true, data: err };
    }
}
