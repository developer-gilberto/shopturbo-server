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
