import { Request, Response } from 'express';
import { IReqBody } from '../../interfaces/user';
import { User } from '../../models/user';
import { signupSchema } from '../../schemas/signup';
import { UsersRepository } from '../../repositories/usersRepository';

export async function signUpService(
    req: Request<{}, {}, IReqBody>,
    res: Response
) {
    const safeData = signupSchema().safeParse(new User(req.body));

    if (!safeData.success) {
        return res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
    }

    const usersRepository = new UsersRepository(safeData.data);

    const queryResult = await usersRepository.getEmail();

    if (queryResult?.email) {
        return res.status(409).json({
            error: true,
            message: 'This email is already in use. Try a different email.',
        });
    }

    const user = await usersRepository.create();

    return res.status(201).json({
        error: false,
        message: 'Account created successfully!',
        data: [user],
    });
}
