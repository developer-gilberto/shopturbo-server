import { type Response, Router } from "express";
import * as accessTokenController from "../domains/accessToken/controllers";
import { authUrlController } from "../domains/authorizationUrl/controllers/authUrlController";
import { docsController } from "../domains/docs/docsController";
import * as orderController from "../domains/orders/controllers";
import * as productController from "../domains/products/controllers";
import * as shopController from "../domains/shop/controllers";
import * as userController from "../domains/user/controllers";
import { verifyJWT } from "../infra/authorization/verifyJWT";
import { rateLimiter, authLimiter } from "../infra/security/rateLimiter";

const router = Router();

router.get("/docs", rateLimiter, docsController);

router.get("/", rateLimiter, (_req, res: Response) => {
  res.status(200).json({
    success: true,
    message:
      "The project documentation is available at GET https://shopturbo-api.gilbertolopes.dev/docs",
  });
});

router.get("/ping", verifyJWT, rateLimiter, (_req, res: Response) => {
  res.status(200).json({ message: "pong" });
});

router.post("/signup", rateLimiter, userController.signUp);
router.post("/signin", authLimiter, userController.signIn);
router.post("/signout", rateLimiter, userController.signOut);

router.get("/api/shopee/auth-url", verifyJWT, rateLimiter, authUrlController);

router.get(
  "/api/shopee/access-token",
  verifyJWT,
  rateLimiter,
  accessTokenController.getAccessToken,
);

router.patch(
  "/api/shopee/access-token",
  verifyJWT,
  rateLimiter,
  accessTokenController.updateAccessToken,
);

router.get(
  "/api/shopee/shop/profile/:shop_id",
  verifyJWT,
  rateLimiter,
  shopController.getShopProfile,
);

router.get(
  "/api/shopee/shop/info/:shop_id",
  verifyJWT,
  rateLimiter,
  shopController.getShopInfo,
);

router.get(
  "/api/shopee/shop/:shop_id/products/full-info",
  verifyJWT,
  rateLimiter,
  productController.getProductsInfo,
);

router.get(
  "/api/shopee/shop/:shop_id/products/id-list",
  verifyJWT,
  rateLimiter,
  productController.getProductsIdList,
);

router.post(
  "/api/shop/:shop_id/products",
  verifyJWT,
  rateLimiter,
  productController.saveProducts,
);

router.get(
  "/api/shop/:shop_id/products",
  verifyJWT,
  rateLimiter,
  productController.getProducts,
);

router.get(
  "/api/shopee/shop/:shop_id/orders/id-list",
  verifyJWT,
  rateLimiter,
  orderController.getOrdersIdList,
);

router.get(
  "/api/shopee/shop/:shop_id/orders/details",
  verifyJWT,
  rateLimiter,
  orderController.getOrdersDetails,
);

export { router };
