import { Request, Response } from 'express';
import { IReqBody } from '../../interfaces/user';
import { signinSchema } from '../../schemas/signin';
import { User } from '../../models/user';
import { UsersRepository } from '../../repositories/usersRepository';
import { comparePassword } from '../../helpers/hashHelper';
import { generateJWT } from '../../helpers/jwtHelper';

export async function signInService(
    req: Request<{}, {}, IReqBody>,
    res: Response
) {
    const safeData = signinSchema().safeParse(new User(req.body));

    if (!safeData.success) {
        return res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
    }

    const usersRepository = new UsersRepository({ name: '', ...safeData.data });

    const storedUser = await usersRepository.getUserByEmail();

    if (!storedUser?.email) {
        return res.status(401).json({
            error: true,
            message: 'Incorrect email and/or password. Access denied.',
        });
    }

    const macth = await comparePassword(
        safeData.data.password,
        storedUser.password
    );

    if (!macth) {
        return res.status(401).json({
            error: true,
            message: 'Incorrect email and/or password. Access denied.',
        });
    }

    const authToken = generateJWT(storedUser);

    return res.status(200).json({
        error: false,
        message: 'Successful login :)',
        data: [{ authToken }],
    });
}
