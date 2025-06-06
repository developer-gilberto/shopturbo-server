import { Request, Response } from 'express';
import { generateSignature } from './generateSignature';
import axios from 'axios';

export async function getAccessToken(req: Request, res: Response) {
    try {
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

        // criar tabelas "shop" e "accessToken" no postgres e criar relacao entre o shop e token

        // depois salvar o token no redis

        /*
        // exemplo da response com dados fakes:
        response.data:  {
            refresh_token: '72734a68544c54656d63664e63481234', // O "refresh_token" é um parâmetro usado para atualizar o access_token. Cada refresh_token é válido por 30 dias e só pode ser usado uma vez pelo shop_id.
            access_token: '6850514259537a7469414c6a6971kuju', // "access_token" é válido por 4 horas e pode ser usado diversas vezes.
            expire_in: 14209, // 4 horas em segundos
            request_id: 'e3e3e7f336003e46d42f697ad63176',
            error: '',
            message: ''
        }
        */

        // -> Cada token é válido por 4 horas e pode ser usado diversas vezes. No entanto, você precisa atualizar o token fazendo uma chamada de RefreshAcessToken antes que ele expire para conseguir um novo token de acesso.
        const accessToken = response.data.access_token;
        // const accessTokenExpireIn = response.data.expire_in;

        // associar o accessToken ao loggedUser

        res.status(200).json({
            accessToken: accessToken,
            dataAccessToken: response.data,
        });
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to get the access token: \x1b[0m\n',
            err
        );
        res.status(500).json({
            error: true,
            message:
                'an error occurred while trying to get the access token :(',
        });
    }
}
