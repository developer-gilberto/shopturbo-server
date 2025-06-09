import { Request, Response } from 'express';
import { IReqBody } from '../../../interfaces/usersInterfaces';
import { signinSchema } from '../../../schemas/signinSchema';
import { UsersRepository } from '../../../repositories/usersRepository';
import { comparePassword } from '../../../helpers/hashHelper';
import { generateJWT } from '../../../helpers/jwtHelper';

export async function signIn(req: Request<{}, {}, IReqBody>, res: Response) {
    try {
        const safeData = signinSchema().safeParse(req.body);

        if (!safeData.success) {
            res.status(400).json({
                error: true,
                message: safeData.error.flatten().fieldErrors,
            });
            return;
        }

        const usersRepository = new UsersRepository({
            name: '',
            ...safeData.data,
        });

        const storedUser = await usersRepository.getUserByEmail();

        if (storedUser === false) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to search for a user in the database.',
            });
            return;
        }

        if (!storedUser) {
            res.status(401).json({
                error: true,
                message: 'Incorrect email and/or password. Access denied.',
            });
            return;
        }

        const macth = await comparePassword(
            safeData.data.password,
            storedUser.password
        );

        if (macth === null) {
            res.status(500).json({
                error: true,
                message: 'An error occurred while trying to hash the password.',
            });
            return;
        }

        if (!macth) {
            res.status(401).json({
                error: true,
                message: 'Incorrect email and/or password. Access denied.',
            });
            return;
        }

        const authToken = generateJWT(storedUser);

        if (!authToken) {
            res.status(500).json({
                error: true,
                message:
                    'An error occurred while trying to generate the token.',
            });
            return;
        }

        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === 'production' || 'homolog'
                    ? true
                    : false,
            sameSite: 'none',
            //   maxAge: response.data.expire_in * 1000, // Em milissegundos
        });

        res.status(200).json({
            error: false,
            message: 'Successful login :)',
            // data: [{ authToken }],
        });
    } catch (err) {
        console.error(
            '\x1b[1m\x1b[31m[ ERROR ] An error occurred while trying to login: \x1b[0m\n',
            err
        );
        res.status(500).json({
            error: true,
            message: 'An error occurred while trying to login :(',
        });
    }
}
