import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CountryService } from "./country.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createCountry = CatchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.createCountry(req.body);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Country created successfully",
    data: result,
  });
});

const getCountries = CatchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.getAllCountries(req.query);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Countries fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCountry = CatchAsync(async (req: Request, res: Response) => {
  const liveRate = req.query.liveRate === "true";

  const result = await CountryService.getCountryById(
    req.params.id as string,
    liveRate,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Country fetched successfully",
    data: result,
  });
});

const updateCountry = CatchAsync(async (req: Request, res: Response) => {
  const result = await CountryService.updateCountry(
    req.params.id as string,
    req.body,
  );

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Country updated successfully",
    data: result,
  });
});

export const CountryController = {
  createCountry,
  getCountries,
  getCountry,
  updateCountry,
};
