import { Request, Response } from "express";
import { generateSignature } from "./generateSignature";
import axios from "axios";
import { ShopRepository } from "../../../../repositories/shopRepository";
import { ExtendedRequest } from "../../../../interfaces/usersInterfaces";

export async function getAccessToken(req: ExtendedRequest, res: Response) {
    try {
        // verificar se o shop ja tem o accessToken no redis e/ou postgres

        const partnerId = Number(process.env.PARTNER_ID!);
        const path = process.env.GET_ACCESS_TOKEN_PATH!;
        const timestamp = Math.floor(Date.now() / 1000);

        const baseString = partnerId + path + timestamp;

        const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

        const host = process.env.AUTH_PARTNER_HOST!;

        const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`;
        const encodeUrl = encodeURI(url);

        const { code, shop_id } = req.query;

        const response = await axios.post(encodeUrl, {
            code: code,
            shop_id: Number(shop_id), // loja que vai conceder a autorizacao ao app
            partner_id: Number(partnerId), // desenvolvedor do app
        });
        /*
        exemplo da response com dados fakes:

        response.data:  {
            refresh_token: '72734a68544c54656d63664e63481234', // válido por 30 dias e só pode ser usado uma vez pelo shop_id.
            access_token: '6850514259537a7469414c6a6971kuju', // válido por 4 horas e pode ser usado diversas vezes.
            expire_in: 14209, // 4 horas em segundos
            request_id: 'e3e3e7f336003e46d42f697ad63176',
            error: '',
            message: ''
        }
        */
        if (response.statusText !== "OK") {
            res.status(response.status).json({
                error: true,
                message: "It was not possible to get the Shopee API access token :(",
            });
            return;
        }

        const loggedUser = req.loggedUser;

        const shopRepo = new ShopRepository({
            shopId: shop_id,
            loggedUser,
            ...response.data,
        });

        // neste ponto eu sei:
        // user logado,
        // shop que autorizou
        // shopeeAccessToken

        //antes de salvar, verificar se ja esta salvo no db(colocar unique no shop da table users para nao duplicar shops)
        const newShop = shopRepo.save();

        if ((await newShop) === null) {
            res.status(500).json({
                error: true,
                message: "An error occurred while trying to save the shop to the database",
            });
            return;
        }

        // salvar o accessToken no redis

        // -> Cada accessToken é válido por 4 horas e pode ser usado diversas vezes. No entanto, você precisa atualizar o token fazendo uma chamada de RefreshAcessToken antes que ele expire para conseguir um novo token de acesso.
        const { refresh_token, ...accessTokenData } = response.data;

        // associar o accessToken ao loggedUser

        res.status(200).json({
            error: false,
            message: "Each accessToken is valid for 4 hours and can be used several times.",
            // data: accessTokenData, //nao enviar o refresh token para o frontend
            data: response.data,
        });
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to get the access token: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message: "an error occurred while trying to get the access token :(",
        });
    }
}
