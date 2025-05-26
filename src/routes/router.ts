import { Router } from 'express';
import * as usersAuthService from '../services/auth/users';
import { verifyToken } from '../middlewares/verifyToken';
import { pingTestService } from '../services/auth/pingTestService';
import * as apiAuthService from '../services/auth/api/shopee';

const router = Router();

router.get('/test/private-ping', verifyToken, pingTestService);

router.post('/auth/users/signup', usersAuthService.signUp);
router.post('/auth/users/signin', usersAuthService.signIn);

router.get(
    '/auth/api/shopee/generate-auth-url',
    verifyToken,
    apiAuthService.generateAuthorizationUrl
);

router.post(
    '/auth/api/shopee/get-access-token',
    verifyToken,
    apiAuthService.getAccessToken
);

// atualizar o accessToken com o refreshToken.
router.post(
    '/auth/api/shopee/update-access-token',
    verifyToken
    // apiAuthService.updateAccessToken
);

export { router };
