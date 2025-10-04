import { Response, Router } from "express";
import * as userController from "../domains/user/controllers";
import { verifyJWT } from "../infra/authorization/verifyJWT";
import * as accessTokenController from "../domains/accessToken/controllers";
import { authUrlController } from "../domains/authorizationUrl/controllers/authUrlController";
import * as shopController from "../domains/shop/controllers";

const router = Router();

router.get("/", (_req, res: Response) => {
    res.status(200).json({ message: "Hello world!" });
});

router.get("/ping", verifyJWT, (_req, res: Response) => {
    res.status(200).json({ message: "pong" });
});

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/signout", userController.signOut);

router.get("/api/shopee/auth-url", verifyJWT, authUrlController);

router.get(
    "/api/shopee/access-token",
    verifyJWT,
    accessTokenController.getAccessToken,
);

router.patch(
    "/api/shopee/access-token",
    verifyJWT,
    accessTokenController.updateAccessToken,
);

router.get(
    "/api/shopee/shop/profile",
    verifyJWT,
    shopController.getShopProfile,
);

export { router };
