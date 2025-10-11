import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../domains/user/interfaces/userInterfaces';

export function generateJWT(user: Omit<IJwtPayload, 'password'>) {
    try {
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
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to generate the JWT: \x1b[0m\n',
            err
        );
        return null;
    }
}
