import { Request, Response } from 'express';
import { IReqBody } from '../../interfaces/usersInterfaces';
import { User } from '../../models/usersModel';
import { signupSchema } from '../../schemas/signupSchema';
import { UsersRepository } from '../../repositories/usersRepository';
import { generateJWT } from '../../helpers/jwtHelper';

export async function signUpService(
    req: Request<{}, {}, IReqBody>,
    res: Response
) {
    try {
        if (!req.body.termsOfUse || req.body.termsOfUse !== 'on') {
            res.status(400).json({
                error: true,
                message:
                    'You must accept the terms of use to create an account!',
            });
            return;
        }

        const safeData = signupSchema().safeParse(req.body);

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const usersRepository = new UsersRepository(safeData.data);

        const storedUser = await usersRepository.getUserByEmail();

        if (storedUser === false) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to search for a user in the database.',
            });
            return;
        }

        if (storedUser) {
            res.status(409).json({
                error: true,
                message: 'This email is already in use. Try a different email.',
            });
            return;
        }

        const user = await usersRepository.create();

        if (!user) {
            res.status(500).json({
                error: true,
                message: 'Error trying to register account in the database.',
            });
            return;
        }

        const authToken = generateJWT(user);

        if (!authToken) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to generate the token.',
            });
            return;
        }

        res.status(201).json({
            error: false,
            message: 'Account created successfully!',
            data: [{ authToken }],
        });
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to create the account: \x1b[0m\n',
            err
        );
        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to create the account :(',
        });
    }
}
