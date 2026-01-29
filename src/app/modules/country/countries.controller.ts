import { Request, Response } from "express";
import { getCountriesCached, getCitiesByIso2 } from "./countries.service";

export const listCountries = async (req: Request, res: Response) => {
  const countries = await getCountriesCached();

  // ✅ return smaller payload (no need to send all cities on home screen)
  const minimal = countries.map((c) => ({
    iso2: c.iso2,
    iso3: c.iso3,
    country: c.country,
  }));

  res.status(200).json({ success: true, data: minimal });
};

export const listCities = async (req: Request, res: Response) => {
  const iso2 = req.params.iso2;

  if (!iso2 || Array.isArray(iso2)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid country ISO code" });
  }

  const cities = await getCitiesByIso2(iso2);

  if (!cities) {
    return res
      .status(404)
      .json({ success: false, message: "Country not found" });
  }

  res
    .status(200)
    .json({ success: true, data: { iso2: iso2.toUpperCase(), cities } });
};
