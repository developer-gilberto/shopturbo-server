import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces/usersInterfaces';
import jwt from 'jsonwebtoken';

export function verifyToken(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            error: true,
            message: 'Token not provided. Access denied :(',
        });

        return;
    }

    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET as string,

            (error, decode: any) => {
                if (error) {
                    console.error(
                        `\x1b[1m\x1b[31m[ ERROR ] ${error.message}: \x1b[0m\n`,
                        error
                    );

                    res.status(401).json({
                        error: true,
                        message: 'Access denied.',
                    });

                    return;
                }

                req.loggedUser = {
                    name: decode.name,
                    email: decode.email,
                };

                next();
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: 'Error verifying authentication token.',
        });
    }
}
