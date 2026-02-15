// src/modules/country/country.routes.ts

import { Router } from "express";
import { CountryController } from "./country.controller";
import { validateRequest } from "../../helpers/validateRequest";
import { createCountryZodSchema } from "./country.validation";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

// Admin only create
router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createCountryZodSchema),
  CountryController.createCountry,
);

// All roles can view
router.get(
  "/",
  checkAuth(...Object.values(Role)),
  CountryController.getAllCountries,
);

export const countryRouter = router;
