import { Router } from "express";

import * as authController from "@/controllers/auth";
import { isAuth } from "@/middlewares/auth";
import * as authSchema from "@/validation/schemas/auth";
import * as validator from "@/validation/validator";

const router = Router();

router.route("/profile").get(isAuth, authController.getCurrentUserProfile);

router
  .route("/register")
  .post(
    validator.validateRequestBody(authSchema.RegisterUserSchema),
    authController.register,
  );

router
  .route("/login")
  .post(
    validator.validateRequestBody(authSchema.LoginUserSchema),
    authController.login,
  );

router
  .route("/get-new-token")
  .post(
    validator.validateRequestBody(authSchema.GetNewTokenSchema),
    authController.getNewToken,
  );

export default router;
