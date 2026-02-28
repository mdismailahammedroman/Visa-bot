/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VisaApplicationService } from "./visa.services";
import { IVisaApplication } from "./visa.interface";

const createVisaApplication = CatchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any; // better: custom payload type
    const userId = user.userId; // ✅ correct key
    // Multer uploaded files
    const files = req.files as Record<string, Express.MulterS3.File[]>;

    const payload: IVisaApplication = {
      ...req.body, // validated body
      trackingId: `TRK-${(uuidv4().split("-")[0] ?? "").toUpperCase()}`,
      userId,
      visaServiceId: req.params.visaServiceId, // from route param
      passportCopy: files.passportCopy?.[0]?.location,
      passportPhoto: files.passportPhoto?.[0]?.location,
      oldVisaCopy: files.oldVisaCopy?.[0]?.location,
      bankStatement: files.bankStatement?.[0]?.location,
    };

    const result = await VisaApplicationService.createVisaApplication(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Visa application created successfully",
      data: result,
    });
  },
);

// Get all Visa Applications (for admin)
const getAllVisaApplications = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await VisaApplicationService.getAllVisaApplications();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Visa applications fetched successfully",
      data: result,
    });
  },
);

const payVisaApplication = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const userId = user.userId;
  const visaApplicationId = req.params.id;

  const result = await VisaApplicationService.payVisaApplication(
    visaApplicationId as string,
    userId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment completed successfully",
    data: result,
  });
});



// 🔹 Get All (Manager)
 const getAllForManager = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaApplicationService.getAllForManager(req.query);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Visa applications retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});



export const VisaApplicationController = {
  // user controllers:
  createVisaApplication,
  getAllVisaApplications,
  payVisaApplication,

  // manager controllers:
  getAllForManager,


};
