import { Router } from "express";
import { userSettingsController } from "./userSettings.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";

export const userSettingsRouter = Router();

userSettingsRouter.get(
  "/me",
  checkAuth(),
  userSettingsController.getMySettings,
);
userSettingsRouter.patch(
  "/me",
  checkAuth(),
  userSettingsController.updateMySettings,
);
