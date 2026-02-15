// src/modules/country/country.controller.ts

import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CountryService } from "./country.service";

const createCountry = CatchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.createCountry(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Country created successfully",
    data: result,
  });
});

const getAllCountries = CatchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.getAllCountries();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Countries fetched successfully",
    data: result,
  });
});

export const CountryController = {
  createCountry,
  getAllCountries,
};
