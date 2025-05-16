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
    if (!req.body.termsOfUse || req.body.termsOfUse !== 'on') {
        return res.status(400).json({
            error: true,
            message: 'You must accept the terms of use to create an account!',
        });
    }

    const safeData = signupSchema().safeParse(new User(req.body));

    if (!safeData.success) {
        return res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
    }

    const usersRepository = new UsersRepository(safeData.data);

    const storedUser = await usersRepository.getUserByEmail();

    if (storedUser) {
        return res.status(409).json({
            error: true,
            message: 'This email is already in use. Try a different email.',
        });
    }

    const user = await usersRepository.create();

    const authToken = generateJWT(user);

    return res.status(201).json({
        error: false,
        message: 'Account created successfully!',
        data: [{ authToken }],
    });
}
