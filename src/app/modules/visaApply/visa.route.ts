import express from "express";
import { VisaApplicationController } from "./visa.controller";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth.middleware";

const router = express.Router();

// -------------------- USER --------------------
router.post(
  "/apply/:visaServiceId",
  checkAuth(Role.USER),
  VisaApplicationController.apply,
);

router.patch(
  "/:id",
  checkAuth(Role.USER),
  VisaApplicationController.updateDraft,
);

router.post(
  "/:id/submit",
  checkAuth(Role.USER),
  VisaApplicationController.submit,
);

router.get(
  "/me",
  checkAuth(Role.USER),
  VisaApplicationController.myApplications,
);

// optional payment endpoint (user)
router.post("/:id/pay", checkAuth(Role.USER), VisaApplicationController.pay);

// -------------------- MANAGER / MAIN_MANAGER --------------------
router.get(
  "/",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.getAllForManager,
);

router.get(
  "/:id/admin",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.getOneForManager,
);

router.patch(
  "/:id/status",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.updateStatus,
);

export default router;
