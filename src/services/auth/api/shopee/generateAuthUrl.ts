import { Request, Response } from 'express';
import { generateSignature } from './generateSignature';

export function generateAuthorizationUrl(_req: Request, res: Response) {
    const partnerId = Number(process.env.PARTNER_ID!);
    const path = process.env.AUTH_PARTNER_PATH!;
    const timestamp = Math.floor(Date.now() / 1000);

    const baseString = partnerId + path + timestamp;

    const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

    const host = process.env.AUTH_PARTNER_HOST;
    const redirectUrl = process.env.REDIRECT_URL;

    const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}&redirect=${redirectUrl}`;
    const authUrl = encodeURI(url);

    res.status(200).json({ authorizationUrl: authUrl });
}
