import { validateRequest } from "../../helpers/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { uploadToS3 } from "../../middlewares/uploadS3";
import { Role } from "../user/user.interface";
import { VisaApplicationController } from "./visa.controller";
import { createVisaApplicationZodSchema } from "./visa.validation";
import { Router } from "express";

const router = Router();

/* =====================================================
   USER ROUTES
===================================================== */

// Apply Visa
router.post(
  "/apply/:visaServiceId",
  checkAuth(Role.USER,Role.ADMIN),
    uploadToS3.fields([
    { name: "passportCopy", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "oldVisaCopy", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  validateRequest(createVisaApplicationZodSchema),
  VisaApplicationController.createVisaApplication,
);

// Update Visa Application (only their own)
router.patch(
  "/update/:id",
  checkAuth(Role.USER),
  VisaApplicationController.updateApplication,
);

router.get(
  "/my-applications",
  checkAuth(Role.USER),
  VisaApplicationController.getMyApplicationsController,
);

// Pay Visa Application
router.post(
  "/pay/:id",
  checkAuth(Role.USER),
  VisaApplicationController.payVisaApplication,
);

/* =====================================================
   ADMIN ROUTES
===================================================== */
// Get all applications (with search/filter/pagination)
router.get(
  "/admin/applications",
  checkAuth(Role.ADMIN),
  VisaApplicationController.getAllApplication,
);

// Get single application by ID
router.get(
  "/admin/application/:id",
  checkAuth(Role.ADMIN),
  VisaApplicationController.getOneApplicationForAdmin,
);

// Assign application to manager
router.patch(
  "/admin/assign/:id",
  checkAuth(Role.ADMIN),
  VisaApplicationController.assignApplication,
);

// Delete application
router.delete(
  "/admin/:id",
  checkAuth(Role.ADMIN),
  VisaApplicationController.deleteVisaApplication,
);

/* =====================================================
   MANAGER ROUTES
===================================================== */

// Get all assigned applications
router.get(
  "/manager/my-applications",
  checkAuth(Role.MANAGER),
  VisaApplicationController.getMyAssignedApplications,
);

// Get single assigned application by ID
router.get(
  "/manager/application/:id",
  checkAuth(Role.MANAGER),
  VisaApplicationController.getOneForManager,
);

// Update assigned application (only assigned one)
router.patch(
  "/manager/update/:id",
  checkAuth(Role.MANAGER),
  VisaApplicationController.applicationUpdateByManager,
);

// Update status (Approved/Rejected)
router.patch(
  "/manager/status/:id",
  checkAuth(Role.MANAGER),
  VisaApplicationController.updateStatus,
);

export const visaApplicationRoute = router;
