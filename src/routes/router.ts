import { Response, Router } from "express";
import * as userController from "../domains/user/controllers";
import { verifyToken } from "../infra/authorization/verifyJWT";
import * as accessTokenController from "../domains/accessToken/controllers";
import { authUrlController } from "../domains/authorizationUrl/controllers/authUrlController";
import * as shopController from "../domains/shop/controllers";

const router = Router();

router.get("/", (_req, res: Response) => {
    res.status(200).json({ message: "Hello world!" });
});

router.get("/ping", verifyToken, (_req, res: Response) => {
    res.status(200).json({ message: "pong" });
});

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

router.get("/api/shopee/auth-url", verifyToken, authUrlController);

router.get(
    "/api/shopee/access-token",
    verifyToken,
    accessTokenController.getAccessToken,
);

router.patch(
    "/api/shopee/access-token",
    verifyToken,
    accessTokenController.updateAccessToken,
);

router.get(
    "/api/shopee/shop/profile",
    verifyToken,
    shopController.getShopProfile,
);

export { router };
