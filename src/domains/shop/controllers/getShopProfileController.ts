import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { generateSignature } from '../../../infra/integrations/shopee/auth/generateSignature';
import { getShopInfoSchema } from '../schemas/getShopInfoSchema';
import { IResponseGetShopProfile } from '../interfaces/shopInterfaces';

export async function getShopProfile(req: Request, res: Response) {
    try {
        const safeData = getShopInfoSchema().safeParse({
            accessToken: req.body.accessToken,
            shopId: Number(req.body.shopId),
        });

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        // preciso verificar se o token ainda eh valido.(acho que um middleware em todas as rotas privadas para verificar se o token ainda eh valido) caso contrario, chamar requestNewAccessToken() ou chamar a rota PATCH /access-token

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_SHOP_PROFILE_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = safeData.data.accessToken;
        const shopId = safeData.data.shopId;

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}?access_token=${accessToken}&partner_id=${partnerId}&shop_id=${shopId}&sign=${sign}&timestamp=${timestamp}`;

        const encodeUrl = encodeURI(url);

        axios
            .get(encodeUrl)
            .then((response: AxiosResponse<IResponseGetShopProfile>) => {
                res.status(200).json({
                    error: false,
                    data: response.data.response,
                });
                return;
            })
            .catch((error) => {
                const httpStatusCode = error.status ? error.status : 500;

                res.status(httpStatusCode).json({
                    error: true,
                    message: error.message,
                    data: null,
                });
                return;
            });
    } catch (err: any) {
        const error = {
            errorMessage: new Error(err.message),
            inner: err,
        };

        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get shop info: \x1b[0m\n',
            error
        );

        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to get shop info :(',
        });
        return;
    }
}
