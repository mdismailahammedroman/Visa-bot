import express from "express";
import { VisaApplicationController } from "./visa.controller";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { uploadToS3 } from "../../middlewares/uploadS3";
import { validateRequest } from "../../helpers/validateRequest";
import { createVisaApplicationZodSchema } from "./visa.validation";

const router = express.Router();

// -------------------- USER --------------------
router.post(
  "/apply/:visaServiceId",
  checkAuth(Role.USER, Role.ADMIN),
  uploadToS3.fields([
    { name: "passportCopy", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "oldVisaCopy", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  validateRequest(createVisaApplicationZodSchema),
  VisaApplicationController.createVisaApplication,
);

// optional payment endpoint (user)
router.post(
  "/:id/pay",
  checkAuth(Role.USER, Role.ADMIN),
  VisaApplicationController.payVisaApplication,
);

// // -------------------- MANAGER / MAIN_MANAGER --------------------
router.get(
  "/",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.getAllForManager,
);

router.get(
  "/:id/application",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.getOneForManager,
);

router.patch(
  "/:id/status",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
  VisaApplicationController.updateStatus,
);
router.delete(
  "/:id/application-delete",
  checkAuth(Role.MANAGER, Role.MAIN_MANAGER, Role.ADMIN),
  VisaApplicationController.deleteVisaApplication,
);

export const visaApplicationRoute = router;
