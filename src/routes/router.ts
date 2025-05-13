import { Router, Request, Response } from 'express';
import { signUpService } from '../services/accounts/signup';
import { signInService } from '../services/accounts/signin';

const router = Router();

router.post('/accounts/signup', (req: Request, res: Response) => {
    signUpService(req, res);
});

router.post('/accounts/signin', (req: Request, res: Response) => {
    // signInService(req, res);
});

export { router };
