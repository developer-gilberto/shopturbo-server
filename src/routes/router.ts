import { Router } from 'express';
import { signUpService } from '../services/accounts/signupService';
import { signInService } from '../services/accounts/signinService';
import { verifyToken } from '../middlewares/verifyToken';
import { pingTestService } from '../services/pingTestService';

const router = Router();

router.get('/private-ping', verifyToken, pingTestService);

router.post('/accounts/signup', (req, res) => {
    signUpService(req, res);
});

router.post('/accounts/signin', (req, res) => {
    signInService(req, res);
});

export { router };
