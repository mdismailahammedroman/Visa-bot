// src/modules/country/country.route.ts
import { Router } from "express";
import { CountryController } from "./country.controller";

import {
  createCountryZodSchema,
  updateCountryZodSchema,
} from "./country.validation";
import { validateRequest } from "../../helpers/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(createCountryZodSchema),
  CountryController.createCountry,
);
router.get("/", CountryController.getCountries);
router.get("/:id", CountryController.getCountry);
router.patch(
  "/:id",
  validateRequest(updateCountryZodSchema),
  CountryController.updateCountry,
);

export const countryRouter = router;
