import axios, { AxiosResponse } from "axios";
import { Response } from "express";
import { generateSignature } from "../../../infra/integrations/shopee/auth/generateSignature";
import { ExtendedReqOrder } from "../interfaces/getOrdersIdListInterfaces";
import { getOrdersIdListSchema } from "../schemas/getOrdersIdListSchema";
import { getValidAccessToken } from "../../accessToken/services";
import { getTimeRange } from "../services/getTimeRanger";

export async function getOrdersIdList(req: ExtendedReqOrder, res: Response) {
    try {
        const { shop_id } = req.params;
        const {
            page_size = 10,
            interval_days = 15,
            time_range_field,
            order_status,
        } = req.query;

        const safeData = getOrdersIdListSchema().safeParse({
            shopId: Number(shop_id),
            intervalDays: Number(interval_days),
            pageSize: Number(page_size),
            timeRangefield: time_range_field,
            orderStatus: order_status,
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
                    "An error occurred while trying to get the validToken.",
            });
            return;
        }

        const { timeFrom, timeTo } = getTimeRange(safeData.data.intervalDays);

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ORDER_LIST_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);
        const accessToken = validTokenData.data!.accessToken;
        const shopId = safeData.data.shopId;

        const baseString = partnerId + path + timestamp + accessToken + shopId;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}`;

        const queryParams = {
            partner_id: partnerId,
            sign,
            timestamp,
            access_token: accessToken,
            shop_id: shopId,
            time_from: timeFrom,
            time_to: timeTo,
            page_size: safeData.data.pageSize,
            time_range_field: safeData.data.timeRangefield,
            order_status: safeData.data.orderStatus,
            response_optional_fields: "order_status",
        };

        const encodeUrl = encodeURI(url);

        axios
            .get(encodeUrl, {
                params: queryParams,
            })
            .then((response: AxiosResponse) => {
                res.status(200).json({
                    error: false,
                    data: response.data.response,
                });
            })
            .catch((err) => {
                const httpStatusCode = err.response?.status || 500;

                console.error(
                    "\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to get_order_list: \x1b[0m\n",
                    err,
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
            "\x1b[1m\x1b[31m[ ERROR ] An unexpected error occurred while trying to get_order_list: \x1b[0m\n",
            error,
        );

        res.status(500).json({
            error: true,
            message: "An error occurred while trying to get_order_list :(",
        });
    }
}
