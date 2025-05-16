import { IJwtPayload } from '../interfaces/usersInterfaces.js';
import jwt from 'jsonwebtoken';

export function generateJWT(user: Omit<IJwtPayload, 'password'>) {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' } // 1dia
        // { expiresIn: 30 } // 30s
    );
}

export function verifyJWT(token: string): IJwtPayload | null {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as IJwtPayload;
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] an error occurred while verifying JWT: \x1b[0m\n',
            err
        );
        return null;
    }
}
