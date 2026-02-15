import { Role } from "./../user/user.interface";
import { checkAuth } from "./../../middlewares/checkAuth.middleware";
// src/modules/visa/visa.route.ts
import { Router } from "express";
import { VisaController } from "./visa.controller";

import {
  createDraftSchema,
  stepCountryDestinationSchema,
  stepServiceVisaSchema,
  stepFeeSchema,
  stepPersonalSchema,
  stepFinancialSchema,
  stepTravelSchema,
  submitSchema,
} from "./visa.validation";
import { validateRequest } from "../../helpers/validateRequest";

const router = Router();

// all visa routes protected

router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(createDraftSchema),
  VisaController.createDraft,
);
router.get("/:id", VisaController.getOne);

router.patch(
  "/:id/step/country-destination",
  checkAuth(Role.USER),
  validateRequest(stepCountryDestinationSchema),
  VisaController.stepCountryDestination,
);
router.patch(
  "/:id/step/service-visa",
  checkAuth(Role.USER),
  validateRequest(stepServiceVisaSchema),
  VisaController.stepServiceVisa,
);
router.patch(
  "/:id/step/fee",
  checkAuth(Role.USER),
  validateRequest(stepFeeSchema),
  VisaController.stepFee,
);
router.patch(
  "/:id/step/personal",
  checkAuth(Role.USER),
  validateRequest(stepPersonalSchema),
  VisaController.stepPersonal,
);
router.patch(
  "/:id/step/financial",
  checkAuth(Role.USER),
  validateRequest(stepFinancialSchema),
  VisaController.stepFinancial,
);
router.patch(
  "/:id/step/travel",
  checkAuth(Role.USER),
  validateRequest(stepTravelSchema),
  VisaController.stepTravel,
);

router.post(
  "/:id/submit",
  checkAuth(Role.USER),
  validateRequest(submitSchema),
  VisaController.submit,
);

export default router;
