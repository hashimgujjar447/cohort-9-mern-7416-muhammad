import { Router } from "express";
import authController from "./auth.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.resetPasswordRequest);
router.post("/reset-password/:token", authController.changeUserPassword);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", AuthMiddleware, authController.logout);

export default router;
