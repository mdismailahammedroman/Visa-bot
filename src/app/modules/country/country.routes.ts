// src/modules/country/country.route.ts
import { Router } from "express";
import { CountryController } from "./country.controller";

const router = Router();

router.post("/", CountryController.createCountry);
router.get("/", CountryController.getCountries);

export const countryRouter = router;
