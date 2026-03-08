import { Router } from "express";
import { ChatController } from "./chat.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/send",
  checkAuth(...Object.values(Role)),
  ChatController.sendMessage
);

export const chatRoute = router;