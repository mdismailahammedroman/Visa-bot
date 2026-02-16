/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/country/country.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CountryService } from "./country.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createCountry = CatchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await CountryService.createCountry(payload);
  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Country created successfully",
    data: result,
  });
});

const getCountries = CatchAsync(async (_req: Request, res: Response) => {
  const countries = await CountryService.getAllCountries();
  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Countries fetched successfully",
    data: countries,
  });
});
export const CountryController = {
  createCountry,
  getCountries,
};
