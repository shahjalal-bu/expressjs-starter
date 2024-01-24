import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { authValidationSchema } from "./auth.validation";
import { role } from "./auth.constant";
import validateAuth from "../../middlewares/validateAuth";

const router = express.Router();
router.post(
  "/register",
  validateRequest(authValidationSchema.registerUserValidationSchema),
  AuthControllers.registerUser
);
router.post(
  "/login",
  validateRequest(authValidationSchema.loginUserValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  validateRequest(authValidationSchema.changePasswordValidationSchema),
  validateAuth(role.admin, role.user),
  AuthControllers.changePassword
);
export const AuthRoutes = router;
