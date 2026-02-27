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
  uploadToS3.fields([
    { name: "passportCopy", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "oldVisaCopy", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  checkAuth(Role.USER, Role.ADMIN, Role.MAIN_MANAGER, Role.MANAGER),
  validateRequest(createVisaApplicationZodSchema),
  VisaApplicationController.createVisaApplication,
);

router.post(
  "/apply/:visaServiceId",
  checkAuth((Role.ADMIN, Role.MAIN_MANAGER, Role.MANAGER)),
  VisaApplicationController.getAllVisaApplications,
);

// // optional payment endpoint (user)
// router.post("/:id/pay", checkAuth(Role.USER), VisaApplicationController.pay);

// // -------------------- MANAGER / MAIN_MANAGER --------------------
// router.get(
//   "/",
//   checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
//   VisaApplicationController.getAllForManager,
// );

// router.get(
//   "/:id/admin",
//   checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
//   VisaApplicationController.getOneForManager,
// );

// router.patch(
//   "/:id/status",
//   checkAuth(Role.MANAGER, Role.MAIN_MANAGER),
//   VisaApplicationController.updateStatus,
// );

export const visaApplicationRoute = router;
