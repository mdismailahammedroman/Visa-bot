import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

/**
 *  Login user (Email + Password)
 */
router.post("/login", authController.credentialLogin);
// =====================================================
//    🔵 GOOGLE AUTH
// =====================================================

router.get("/google", authController.googleStart);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback,
);

/* =====================================================
    APPLE AUTH
===================================================== */

router.get("/apple", authController.appleStart);

router.post(
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  authController.appleCallback,
);

/* =====================================================
    PASSWORD MANAGEMENT
===================================================== */

/**
 *  Forgot password (send OTP)
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 *  Verify OTP
 */
router.post("/verify-otp", authController.verifyOTP);

/**
 *  Reset password
 */
router.post("/reset-password", authController.resetPassword);

/**
 *  Change password (Authenticated)
 */
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authController.changePassword,
);

/**
 *  Logout
 */
router.post(
  "/logout",
  checkAuth(...Object.values(Role)),
  authController.logout,
);

export const authRouter = router;
