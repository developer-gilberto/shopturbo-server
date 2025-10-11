import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';
import { generateSignature } from '../../../infra/integrations/shopee/auth/generateSignature';
import { ExtendedReq } from '../interfaces/productsInterfaces';
import { getProductSchema } from '../schemas/getProductSchema';
import { AccessTokenRepository } from '../../accessToken/repositories/accessTokenRepository';

export async function getProduct(req: ExtendedReq, res: Response) {
    try {
        const { shop_id, item_id } = req.params;

        const safeData = getProductSchema().safeParse({
            shopId: Number(shop_id),
            itemId: Number(item_id),
        });

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const tokenRepo = new AccessTokenRepository();

        const accessTokenData = await tokenRepo.getTokenByShopId(
            safeData.data.shopId
        );

        if (accessTokenData.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to search for the accessToken in the database.',
            });
            return;
        }

        if (!accessTokenData.data) {
            res.status(404).json({
                error: true,
                message: 'AccessToken not found.',
            });
            return;
        }

        // preciso verificar se o token ainda eh valido.(acho que um middleware em todas as rotas privadas para verificar se o token ainda eh valido) caso contrario, chamar requestNewAccessToken() ou chamar a rota PATCH /access-token

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ITEM_BASE_INFO_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = accessTokenData.data.accessToken;

        const shopId = Number(safeData.data.shopId);

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const itemIdList = [Number(safeData.data.itemId)]; // pode ser um array -> [34001,34002]

        const url = `${host}${path}?partner_id=${partnerId}&sign=${sign}&timestamp=${timestamp}&shop_id=${shopId}&access_token=${accessToken}&item_id_list=${itemIdList}&need_tax_info=true&need_complaint_policy=true`;
        // need_tax_info=true&need_complaint_policy=true -> são opcionais!!!

        const encodeUrl = encodeURI(url);

        axios
            .get(encodeUrl)
            .then((response: AxiosResponse) => {
                res.status(200).json({
                    error: false,
                    data: response.data.response,
                });
                return;
            })
            .catch((err) => {
                const httpStatusCode = err.status ? err.status : 500;

                const error = {
                    errorMessage: new Error(err.message),
                    inner: err,
                };

                console.error(
                    '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_item_base_info: \x1b[0m\n',
                    error
                );

                res.status(httpStatusCode).json({
                    error: true,
                    message: err.message,
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
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_item_base_info: \x1b[0m\n',
            error
        );

        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to get_item_base_info :(',
        });
        return;
    }
}
