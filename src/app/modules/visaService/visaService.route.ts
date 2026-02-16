import { Router } from "express";
import { VisaServiceController } from "./visaService.controller";
import {
  createVisaServiceZodSchema,
  updateVisaServiceZodSchema,
} from "./visaService.validation";
import { validateRequest } from "../../helpers/validateRequest";

const router = Router();

// ✅ Country wise
router.post(
  "/countries/:countryId/visa-services",
  validateRequest(createVisaServiceZodSchema),
  VisaServiceController.createForCountry,
);

router.get(
  "/countries/:countryId/visa-services",
  VisaServiceController.getByCountry,
);

// ✅ single visa service
router.get("/visa-services/:id", VisaServiceController.getOne);
router.patch(
  "/visa-services/:id",
  validateRequest(updateVisaServiceZodSchema),
  VisaServiceController.update,
);

export const visaServiceRouter = router;
