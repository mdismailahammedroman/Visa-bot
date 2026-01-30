import { Router } from "express";
import { listCountries, listCities } from "./countries.controller";

const router = Router();

router.get("/", listCountries);
router.get("/:iso2/cities", listCities);

export const countryRouter = router;
