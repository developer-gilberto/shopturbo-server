import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';
import { generateSignature } from '../../../infra/integrations/shopee/auth/generateSignature';
import { ExtendedReqOrderDetails } from '../interfaces/ordersDetailsInterfaces';
import { ordersDetailsSchema } from '../schemas/ordersDetailsSchema';
import { getValidAccessToken } from '../../accessToken/services/getValidAccessToken';
import { diff } from 'node:util';

export async function getOrdersDetails(
    req: ExtendedReqOrderDetails,
    res: Response
) {
    try {
        const safeData = ordersDetailsSchema().safeParse({
            shopId: Number(req.params.shop_id),
            orderIdList: req.query.order_id_list,
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
        const path = process.env.GET_ORDER_DETAIL_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = validTokenData.data?.accessToken;

        const shopId = Number(safeData.data.shopId);

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        // orderIdList -> pode ser uma string com o order_sn(id do pedido) de um único pedido ou um array de strings com o order_sn de ate 50 pedidos
        const orderIdList = safeData.data.orderIdList;

        const responseOptionalFields =
            'buyer_user_id,buyer_username,estimated_shipping_fee,recipient_address,actual_shipping_fee ,goods_to_declare,note,note_update_time,item_list,pay_time,dropshipper, dropshipper_phone,split_up,buyer_cancel_reason,cancel_by,cancel_reason,actual_shipping_fee_confirmed,buyer_cpf_id,fulfillment_flag,pickup_done_time,package_list,shipping_carrier,payment_method,total_amount,buyer_username,invoice_data,order_chargeable_weight_gram,return_request_due_date,edt,payment_info';

        const url = `${host}${path}?partner_id=${partnerId}&sign=${sign}&timestamp=${timestamp}&shop_id=${shopId}&access_token=${accessToken}&order_sn_list=${orderIdList}&request_order_status_pending=true&response_optional_fields=${responseOptionalFields}`;

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
                    '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_order_detail: \x1b[0m\n',
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
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_order_detail: \x1b[0m\n',
            error
        );

        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to get_order_detail :(',
        });
        return;
    }
}
