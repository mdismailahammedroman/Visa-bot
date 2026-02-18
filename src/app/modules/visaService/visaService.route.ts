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

// ✅ Country-wise - Admin / Main Manager only
router.post(
  "/visa-services/countries/:countryId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  validateRequest(createVisaServiceZodSchema),
  VisaServiceController.createForCountry,
);

// ✅ Country-wise GET - any authenticated user
router.get(
  "/visa-services/countries/:countryId",
  checkAuth(...Object.values(Role)), // user, admin, manager can read
  VisaServiceController.getByCountry,
);

// ✅ Single service GET - any authenticated user
router.get(
  "/visa-services/:id",
  checkAuth(...Object.values(Role)),
  VisaServiceController.getOne,
);

// ✅ Update service - Admin / Main Manager only
router.patch(
  "/visa-services/:id",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  validateRequest(updateVisaServiceZodSchema),
  VisaServiceController.update,
);

// ✅ Optional delete - Admin only
router.delete(
  "/visa-services/:id",
  checkAuth(Role.ADMIN),
  VisaServiceController.delete,
);

export const visaServiceRouter = router;
      