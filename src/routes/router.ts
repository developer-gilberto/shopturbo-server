import { Response, Router } from "express";
import * as userController from "../domains/user/controllers";
import { verifyToken } from "../infra/authorization/verifyJWT";
import { accessTokenController } from "../domains/accessToken/controllers/accessTokenController";
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

router.get("/api/shopee/get-auth-url", verifyToken, authUrlController);

router.post("/api/shopee/get-access-token", verifyToken, accessTokenController);

router.post(
    "/api/shopee/update-access-token",
    verifyToken,
    // verificar se shopId tem um accessToken valido no db
    // accessTokenController.updateAccessToken
);

router.get(
    "/api/shopee/get-shop-profile",
    verifyToken,
    shopController.getShopProfile,
);

export { router };
