import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

// User routes
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  NotificationController.getMyNotifications,
);

router.patch(
  "/:id/read",
  checkAuth(...Object.values(Role)),
  NotificationController.markAsRead,
);

router.patch(
  "/read-all",
  checkAuth(...Object.values(Role)),
  NotificationController.markAllAsRead,
);

// Admin
router.post(
  "/send",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  NotificationController.sendNotificationToUsers,
);

export const notificationRouter = router;
