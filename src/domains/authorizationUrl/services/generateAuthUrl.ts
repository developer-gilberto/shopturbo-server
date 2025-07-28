import { generateSignature } from "../../../infra/integrations/shopee/auth/generateSignature";

export function generateAuthUrl(): {
    error: boolean;
    authUrl: string | null;
} {
    try {
        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.AUTHORIZATION_URL_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);

        const baseString = partnerId + path + timestamp;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;
        const redirectUrl = process.env.REDIRECT_URL!;

        const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}&redirect=${redirectUrl}`;

        return { error: false, authUrl: encodeURI(url) };
    } catch (err: any) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to generate the authorization url: \x1b[0m\n",
            err,
        );
        return { error: true, authUrl: null };
    }
}
