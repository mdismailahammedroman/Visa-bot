import { Router } from "express";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { activityLogController } from "./activityLog.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  activityLogController.getActivityLogsController,
);

export const activityLogRoute = router;