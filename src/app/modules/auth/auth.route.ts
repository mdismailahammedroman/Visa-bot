import { Router } from "express";
import { authController } from "./auth.controller";

export const router = Router();

router.post("/login", authController.credentialLogin);
