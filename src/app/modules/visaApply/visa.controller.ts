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
    const userId = user._id; // ✅ correct key
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

const updateApplication = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IVisaApplication> = req.body;
  const result = await VisaApplicationService.updateApplication(
    id as string,
    payload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Visa application updated successfully",
    data: result,
  });
});

const getMyApplicationsController = CatchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const result = await VisaApplicationService.getMyApplications(
      user._id,
      req.query
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User applications retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);



/* ========================= ADMIN ========================= */
const getAllApplication = CatchAsync(async (req: Request, res: Response) => {
  const result = await VisaApplicationService.getAllApplication(req.query);

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All applications retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getOneApplicationForAdmin = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await VisaApplicationService.getOneApplicationForAdmin(
      id as string,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Application retrieved successfully",
      data: result,
    });
  },
);

const assignApplication = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { managerId } = req.body;
  const admin = (req.user as any)._id;

  const result = await VisaApplicationService.assignApplication(
    id as string,
    managerId,
    admin,
  );

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application assigned successfully",
    data: result,
  });
});

const deleteVisaApplication = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await VisaApplicationService.deleteVisaApplication(
      id as string,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Application deleted successfully",
      data: result,
    });
  },
);

/* ========================= MANAGER ========================= */
const getMyAssignedApplications = CatchAsync(
  async (req: Request, res: Response) => {
    const manager = (req.user as any)._id;

    const result = await VisaApplicationService.getMyAssignedApplications(
      manager,
      req.query,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My assigned applications retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getOneForManager = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await VisaApplicationService.getOneForManager(id as string);

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application retrieved successfully",
    data: result,
  });
});

const applicationUpdateByManager = CatchAsync(
  async (req: Request, res: Response) => {
    const manager = (req.user as any)._id;
    const { id } = req.params;
    const payload = req.body;

    const result = await VisaApplicationService.applicationUpdateByManager(
      id as string,
      manager,
      payload,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Application updated successfully",
      data: result,
    });
  },
);

const updateStatus = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await VisaApplicationService.updateStatus(
    id as string,
    status,
  );

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Application status updated successfully",
    data: result,
  });
});

export const VisaApplicationController = {
  createVisaApplication,
  updateApplication,
  getMyApplicationsController,

  getAllApplication,
  getOneApplicationForAdmin,
  assignApplication,
  deleteVisaApplication,
  getMyAssignedApplications,
  getOneForManager,
  applicationUpdateByManager,
  updateStatus,
};
