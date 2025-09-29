import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IJwtPayload } from "../../domains/user/interfaces/userInterfaces";

export type ExtendedRequest = Request & {
    loggedUser?: IJwtPayload;
};

export function verifyJWT(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
): void {
    const token: string = req.cookies.token;

    if (!token) {
        res.status(401).json({
            error: true,
            message: "Access denied :(",
        });
        return;
    }

    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET!,

            (error, decode: any) => {
                if (error) {
                    console.error(
                        `\x1b[1m\x1b[31m[ ERROR ] ${error.message}: \x1b[0m\n`,
                        error,
                    );

                    res.status(401).json({
                        error: true,
                        message: "Access denied.",
                    });

                    return;
                }

                req.loggedUser = {
                    id: decode.id,
                    name: decode.name,
                    email: decode.email,
                };

                next();
            },
        );
    } catch (err) {
        console.error(
            `\x1b[1m\x1b[31m[ ERROR ] Error verifying authentication token: \x1b[0m\n`,
            err,
        );
        res.status(500).json({
            error: true,
            message: "Error verifying authentication token.",
        });
    }
}
