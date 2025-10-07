import { Request, Response } from 'express';
import { signInSchema } from '../schemas/signInSchema';
import { IRequestBody } from '../interfaces/userInterfaces';
import { UserRepository } from '../repositories/userRepository';
import { generateJWT } from '../../../infra/authentication/generateJWT';
import { comparePassword } from '../../../infra/security/comparePassword';

export async function signIn(
    req: Request<{}, {}, IRequestBody>,
    res: Response
) {
    try {
        const safeData = signInSchema().safeParse(req.body);

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const userRepo = new UserRepository();

        const storedUser = await userRepo.getUserByEmail(safeData.data.email);

        if (storedUser.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to search for a user in the database.',
            });
            return;
        }

        if (!storedUser.data) {
            res.status(401).json({
                error: true,
                message: 'Incorrect email and/or password. Access denied.',
            });
            return;
        }

        const result = await comparePassword(
            safeData.data.password,
            storedUser.data.password
        );

        if (result.error) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to check the password.',
            });
            return;
        }

        if (!result.match) {
            res.status(401).json({
                error: true,
                message: 'Incorrect email and/or password. Access denied.',
            });
            return;
        }

        const token = generateJWT(storedUser.data);

        if (!token) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to generate the token.',
            });
            return;
        }

        res.status(200).json({
            error: false,
            message: 'Successful login :)',
            token,
        });
        return;
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to login: \x1b[0m\n',
            err
        );
        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to login :(',
        });
        return;
    }
}
