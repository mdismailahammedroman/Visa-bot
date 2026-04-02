import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/admin-overview",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER, Role.MANAGER),
  DashboardController.getAdminOverview,
);

router.get(
  "/analytics",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  DashboardController.getAnalytics,
);

export const dashboardRoute = router;
