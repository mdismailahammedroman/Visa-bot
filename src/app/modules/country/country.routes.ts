import { Router } from "express";
import { CountryController } from "./country.controller";
import {
  createCountryZodSchema,
  updateCountryZodSchema,
} from "./country.validation";
import { validateRequest } from "../../helpers/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

// ✅ Create Country
router.post(
  "/",
  checkAuth(Role.MAIN_MANAGER, Role.ADMIN),
  validateRequest(createCountryZodSchema),
  CountryController.createCountry,
);

// ✅ Get All Countries
router.get(
  "/",
  checkAuth(...Object.values(Role)), // all authenticated users
  CountryController.getCountries,
);

// ✅ Get Single Country
router.get(
  "/:id",
  checkAuth(...Object.values(Role)), // all authenticated users
  CountryController.getCountry,
);

// ✅ Update Country
router.patch(
  "/:id",
  checkAuth(Role.MAIN_MANAGER, Role.ADMIN),
  validateRequest(updateCountryZodSchema),
  CountryController.updateCountry,
);


router.delete(
  "/:id",
  checkAuth(Role.MAIN_MANAGER, Role.ADMIN),
  CountryController.deleteCountry,
);


export const countryRouter = router;
