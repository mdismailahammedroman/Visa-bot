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


// "/visa-services/search"
router.get(
  "/visa-services/search",
  checkAuth(...Object.values(Role)),
  VisaServiceController.searchVisaServicesController,
);

/**
 * Get services by country (pagination supported)
 */
router.get(
  "/countries/:countryId/visa-services",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getByCountry,
);


/**+
 * getAll
 */
router.get(
  "/visa-services",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getAllVisaServicesController,
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
 * Update Status
 */
router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  VisaServiceController.updateStatus,
);


/**
 * Delete service
 */
router.get(
  "/visa-services/search/:countryId",
  checkAuth(...Object.values(Role)),
  VisaServiceController.searchVisaServicesController
);



export const visaServiceRouter = router;
