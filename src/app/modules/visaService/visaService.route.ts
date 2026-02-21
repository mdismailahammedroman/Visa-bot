import { Router } from "express";
import { VisaServiceController } from "./visaService.controller";
import {
  createVisaServiceZodSchema,
  updateVisaServiceZodSchema,
} from "./visaService.validation";
import { validateRequest } from "../../helpers/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

/**
 * Create service for specific country
 */
router.post(
  "/countries/:countryId/visa-services",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  validateRequest(createVisaServiceZodSchema),
  VisaServiceController.createForCountry,
);

/**
 * Get services by country (pagination supported)
 */
router.get(
  "/countries/:countryId/visa-services",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getByCountry,
);

/**
 * Get single service by ID
 */
router.get(
  "/visa-services/:id",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getOne,
);

/**
 * Update service
 */
router.patch(
  "/visa-services/:id",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  validateRequest(updateVisaServiceZodSchema),
  VisaServiceController.update,
);

/**
 * getByCategory
 */
router.get(
  "/countries/:countryId/visa-services/category/:category",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getByCategory,
);


/**+
 * getAll
 */
router.get("/visa-services", checkAuth(...Object.values(Role)), VisaServiceController.getAllVisaServicesController);

/**
 * Delete service
 */
router.delete(
  "/visa-services/:id",
  checkAuth(Role.ADMIN),
  VisaServiceController.delete,
);

export const visaServiceRouter = router;
