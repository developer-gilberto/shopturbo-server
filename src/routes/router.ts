import { Router } from 'express';
import * as usersAuthService from '../services/auth/users';
import { verifyToken } from '../middlewares/verifyToken';
import { pingTestService } from '../services/auth/pingTestService';
import * as apiAuthService from '../services/auth/api/shopee';

const router = Router();

router.get('/test/private-ping', verifyToken, pingTestService);

router.post('/auth/users/signup', usersAuthService.signUp);
router.post('/auth/users/signin', usersAuthService.signIn);

// Gerar o link de autorização,
router.get(
    '/auth/api/shopee/generate-auth-url',
    verifyToken,
    apiAuthService.generateAuthorizationUrl
);
// adquirir autorização da loja,
// usar o código de autorização,
// obter e atualizar o token de acesso.

export { router };
