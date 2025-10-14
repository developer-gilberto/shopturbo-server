import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';
import { generateSignature } from '../../../infra/integrations/shopee/auth/generateSignature';
import { ExtendedReq } from '../interfaces/productsInterfaces';
import { getProductsIdListSchema } from '../schemas/getProductsIdListSchema';
import { AccessTokenRepository } from '../../accessToken/repositories/accessTokenRepository';

export async function getProductsIdList(req: ExtendedReq, res: Response) {
    try {
        const { shop_id } = req.params;
        const { offset = 0, page_size = 10, item_status } = req.query;

        const safeData = getProductsIdListSchema().safeParse({
            shopId: Number(shop_id),
            offset: Number(offset),
            pageSize: Number(page_size),
            itemStatus: item_status,
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

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ITEM_LIST_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = accessTokenData.data.accessToken;
        const shopId = safeData.data.shopId;

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}?partner_id=${partnerId}&sign=${sign}&timestamp=${timestamp}&access_token=${accessToken}&shop_id=${shopId}&offset=${
            safeData.data.offset
        }&page_size=${safeData.data.pageSize}&item_status=${encodeURIComponent(
            safeData.data.itemStatus
        )}`;

        const encodeUrl = encodeURI(url);

        axios
            .get(encodeUrl)
            .then((response: AxiosResponse) => {
                res.status(200).json({
                    error: false,
                    data: response.data.response,
                });
            })
            .catch((err) => {
                const httpStatusCode = err.response?.status || 500;

                console.error(
                    '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_item_list: \x1b[0m\n',
                    err
                );

                res.status(httpStatusCode).json({
                    error: true,
                    message: err.message,
                    data: null,
                });
            });
    } catch (err: any) {
        const error = {
            errorMessage: new Error(err.message),
            inner: err,
        };

        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An unexpected error occurred while trying to get_item_list: \x1b[0m\n',
            error
        );

        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to get_item_list :(',
        });
    }
}
