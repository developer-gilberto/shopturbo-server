import { Response, Router } from "express";
import * as userController from "../domains/user/controllers";
import { verifyJWT } from "../infra/authorization/verifyJWT";
import * as accessTokenController from "../domains/accessToken/controllers";
import { authUrlController } from "../domains/authorizationUrl/controllers/authUrlController";
import * as shopController from "../domains/shop/controllers";
import * as productController from "../domains/products/controllers";
import * as orderController from "../domains/orders/controllers";
import { docsController } from "../domains/docs/docsController";

const router = Router();

router.get("/docs", docsController);

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
    "/api/shopee/shop/profile/:shop_id",
    verifyJWT,
    shopController.getShopProfile,
);

router.get(
    "/api/shopee/shop/:shop_id/products/full-info", // + ?item_id_list=892607435,885174198
    verifyJWT,
    productController.getProductsInfo,
);

router.get(
    "/api/shopee/shop/:shop_id/products/id-list", // + ?offset=0&page_size=100&item_status=NORMAL
    verifyJWT,
    productController.getProductsIdList,
);

router.get(
    "/api/shopee/shop/:shop_id/orders", // + ?&page_size=100&interval_days=15&time_range_field=create_time&order_status=READY_TO_SHIP
    verifyJWT,
    orderController.getOrdersIdList,
);

export { router };
