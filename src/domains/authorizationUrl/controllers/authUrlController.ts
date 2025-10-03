import { Request, Response } from "express";
import { generateAuthUrl } from "../services/generateAuthUrl";

export function authUrlController(_req: Request, res: Response) {
    try {
        const result = generateAuthUrl();

        if (result.error) {
            res.status(500).json({
                error: true,
                message:
                    "An error occurred while trying to generate the authorization url :(",
            });
            return;
        }

        res.status(200).json({
            error: false,
            authorizationUrl: result.authUrl,
        });
        return;
    } catch (err) {
        console.error(
            "\x1b[1m\x1b[31m[ ERROR ] an error occurred while trying to generate the authorization url: \x1b[0m\n",
            err,
        );
        res.status(500).json({
            error: true,
            message:
                "An error occurred while trying to generate the authorization url :(",
        });
        return;
    }
}
