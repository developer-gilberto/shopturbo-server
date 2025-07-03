import { Request, Response } from "express";
import { generateSignature } from "./generateSignature";
import axios from "axios";
import { ShopRepository } from "../../../../repositories/shopRepository";
import { ExtendedRequest } from "../../../../interfaces/usersInterfaces";
import { UsersRepository } from "../../../../repositories/usersRepository";

export async function getAccessToken(req: ExtendedRequest, res: Response) {
    try {
        const { code, shop_id } = req.query;
        // -> verificar se o shop ja tem o accessToken no redis e/ou postgres.

        // usando o shop_id que vem da query da rota, verificar se ja existe um shop no db.
        // se existir, verificar se o token ainda eh valido.
        // senao salvar o shop no db.
        const shopRepo = new ShopRepository();

        const storedShop = await shopRepo.getShopAndTokenByUserId(Number(req.loggedUser!.id));
        // antes de salvar, verificar se ja esta salvo no db para nao duplicar shops

        console.log(storedShop);

        if (storedShop === false) {
            res.status(500).json({
                error: true,
                message: "An error occurred while trying to search for the ShopWithToken in the database.",
            });
            return;
        }

        if (storedShop === null) {
            const partnerId = Number(process.env.PARTNER_ID!);
            const path = process.env.GET_ACCESS_TOKEN_PATH!;
            const timestamp = Math.floor(Date.now() / 1000);

            const baseString = partnerId + path + timestamp;

            const sign = generateSignature(baseString, process.env.PARTNER_KEY!);

            const host = process.env.AUTH_PARTNER_HOST!;

            const url = `${host}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`;
            const encodeUrl = encodeURI(url);

            const response = await axios.post(encodeUrl, {
                code: code,
                shop_id: Number(shop_id), // loja que vai conceder a autorizacao ao app
                partner_id: Number(partnerId), // desenvolvedor do app
            });

            if (response.statusText !== "OK") {
                res.status(response.status).json({
                    error: true,
                    message: "It was not possible to get the Shopee API access token :(",
                });
                return;
            }
            // neste ponto eu sei:
            // user logado,
            // shop que autorizou,
            // shopeeAccessToken,

            const newShop = shopRepo.save({
                shopId: Number(shop_id),
                userId: req.loggedUser!.id,
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                expireIn: response.data.expire_in,
            });

            if (newShop === null) {
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
                data: accessTokenData, //nao enviar o refresh token para o frontend
            });
            return;
        }

        // if (storedShop) //significa que a loja ja foi salva. agora preciso verificar se o token ainda eh valido.

        const expiresAt = new Date(
            storedShop.ShopeeAccessToken!.createdAt.getTime() + storedShop.ShopeeAccessToken!.expireIn * 1000,
        );

        const validToken = new Date() < expiresAt;
        // const validToken = new Date() < new Date("2021-01-01T00:44:59.614Z"); // <- teste com token expirado

        // if (!validToken) // fazer uma request para refresh token

        const accessTokenData = {
            shopId: storedShop.ShopeeAccessToken?.shopId,
            accessToken: storedShop.ShopeeAccessToken?.accessToken,
            expiresAt,
        };

        res.status(200).json({
            error: false,
            message: `The token will expire in: '${expiresAt}'`,
            accessToken: accessTokenData,
        });
        return;
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
