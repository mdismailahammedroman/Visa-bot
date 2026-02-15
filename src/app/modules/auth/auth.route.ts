import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

/**
 * 🔹 login user
 * POST /auth/login
 * Body: { email: string , password}
 */

router.post("/login", authController.credentialLogin);

/**
 * 🔹 Forgot password (send OTP)
 * POST /auth/forgot-password
 * Body: { email: string }
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * 🔹 Verify OTP for forgot password
 * POST /auth/verify-otp
 * Body: { email: string, otp: string }
 */
router.post("/verify-otp", authController.verifyOTP);

/**
 * 🔹 Reset password after OTP verified
 * POST /auth/reset-password
 * Body: { email: string, newPassword: string }
 */
router.post("/reset-password", authController.resetPassword);

/**
 * 🔹 Change password (for logged-in users)
 * POST /auth/change-password
 * Body: { oldPassword: string, newPassword: string }
 * Header: Authorization: Bearer <token>
 */
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authController.changePassword,
);

/**
 * 🔹 Logout
 * POST /auth/logout
 * Header: Authorization: Bearer <token>
 */
router.post(
  "/logout",
  checkAuth(...Object.values(Role)),
  authController.logout,
);

export const authRouter = router;
