import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";

export const router = Router();

router.post("/login", authController.credentialLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/logout", checkAuth(), authController.logout);

export const authRouter = router;
