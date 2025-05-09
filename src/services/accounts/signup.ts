import { Request, Response } from 'express';
import { IReqBody } from '../../interfaces/user';
import { signupSchema } from '../../schemas/signup';
import { User } from '../../models/user';

export function signUpService(req: Request<{}, {}, IReqBody>, res: Response) {
    const safeData = signupSchema().safeParse(new User(req.body));

    if (!safeData.success) {
        return res.status(400).json({
            error: true,
            message: safeData.error.flatten().fieldErrors,
        });
    }

    // criar docker-compose.yaml para o postgres e redis
    // prisma -D
    // const email = await authUser.findEmail();

    return res.status(201).json({
        error: false,
        message: 'Account created successfully!',
        data: [],
    });
}
