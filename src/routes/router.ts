import { type Response, Router } from "express";
import * as accessTokenController from "../domains/accessToken/controllers";
import { authUrlController } from "../domains/authorizationUrl/controllers/authUrlController";
import { docsController } from "../domains/docs/docsController";
import * as orderController from "../domains/orders/controllers";
import * as productController from "../domains/products/controllers";
import * as shopController from "../domains/shop/controllers";
import * as userController from "../domains/user/controllers";
import { verifyJWT } from "../infra/authorization/verifyJWT";

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
  "/api/shopee/shop/info/:shop_id",
  verifyJWT,
  shopController.getShopInfo,
);

router.get(
  "/api/shopee/shop/:shop_id/products/full-info",
  verifyJWT,
  productController.getProductsInfo,
);

router.get(
  "/api/shopee/shop/:shop_id/products/id-list",
  verifyJWT,
  productController.getProductsIdList,
);

router.post(
  "/api/shop/:shop_id/products",
  verifyJWT,
  productController.saveProducts,
);

router.get(
  "/api/shop/:shop_id/products",
  verifyJWT,
  productController.getProducts,
);

router.get(
  "/api/shopee/shop/:shop_id/orders/id-list",
  verifyJWT,
  orderController.getOrdersIdList,
);

router.get(
  "/api/shopee/shop/:shop_id/orders/details",
  verifyJWT,
  orderController.getOrdersDetails,
);

export { router };
