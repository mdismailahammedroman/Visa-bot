import { Router } from "express";
import { userController } from "./user.controller";

export const router = Router();

router.post("/register", userController.registerUser);

export const userRouter = router;
