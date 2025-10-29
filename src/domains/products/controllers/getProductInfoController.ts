import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';
import { generateSignature } from '../../../infra/integrations/shopee/auth/generateSignature';
import { ExtendedReq } from '../interfaces/productsInterfaces';
import { getProductInfoSchema } from '../schemas/getProductInfoSchema';
import { getValidAccessToken } from '../../accessToken/services/getValidAccessToken';

export async function getProductsInfo(req: ExtendedReq, res: Response) {
    try {
        const safeData = getProductInfoSchema().safeParse({
            shopId: Number(req.params.shop_id),
            itemIdList: req.query.item_id_list,
        });

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const validTokenData = await getValidAccessToken(safeData.data.shopId);

        if (validTokenData.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to get the validToken.',
            });
            return;
        }

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ITEM_BASE_INFO_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = validTokenData.data?.accessToken;

        const shopId = Number(safeData.data.shopId);

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        // itemIdList -> pode ser um number com o id de um único produto ou um array de numbers com o id de ate 50 produtos
        const itemIdList = safeData.data.itemIdList;

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
                    error,
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
            error,
        );

        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to get_item_base_info :(',
        });
        return;
    }
}
