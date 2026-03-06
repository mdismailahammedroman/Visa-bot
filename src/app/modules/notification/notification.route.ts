import express from "express";
import { NotificationController } from "./notification.controller";
import { checkAuth as auth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface"; // Adjust if Role enum is elsewhere

const router = express.Router();

// Get my notifications
router.get("/", auth(Role.USER, Role.ADMIN, Role.MAIN_MANAGER), NotificationController.getMyNotifications);

// Mark all as read
router.patch("/read-all", auth(Role.USER, Role.ADMIN, Role.MAIN_MANAGER), NotificationController.markAllAsRead);

// Mark single notification as read
router.patch("/:id/read", auth(Role.USER, Role.ADMIN, Role.MAIN_MANAGER), NotificationController.markAsRead);

export const notificationRoute = router;
