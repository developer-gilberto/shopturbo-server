import { Router, Request, Response } from 'express';
import { signUpService } from '../services/accounts/signup';

const router = Router();

router.get('/accounts/signup', (req: Request, res: Response) => {
    signUpService(req, res);
});

export { router };
