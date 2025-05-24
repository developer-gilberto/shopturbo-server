import { Router } from 'express';
import * as usersAuthService from '../services/auth/users';
import { verifyToken } from '../middlewares/verifyToken';
import { pingTestService } from '../services/auth/pingTestService';

const router = Router();

router.get('/test/private-ping', verifyToken, pingTestService);

router.post('/auth/users/signup', usersAuthService.signUp);
router.post('/auth/users/signin', usersAuthService.signIn);

export { router };
