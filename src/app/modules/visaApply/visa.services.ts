/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import { ApplicationStatus, IVisaApplication } from "./visa.interface";
import { VisaApplicationRepository } from "./visa.repository";
import { VisaServiceRepository } from "../visaService/visaService.repository";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Types } from "mongoose";
import { userRepository } from "../user/user.repository";
import { Role } from "../user/user.interface";
import { NotificationService } from "../notification/notification.service";
import { convertToUSD } from "../../utils/currency";
import { getUserCurrency } from "../../utils/userCurrency";
import { getCurrencyRate } from "../../utils/fixer";
import { ActivityLogService } from "../activity/activityLog.service";
import { NotificationType } from "../notification/notification.interface";

const createVisaApplication = async (payload: IVisaApplication) => {
  const applyVisaServices = await VisaServiceRepository.findById(
    payload.visaServiceId.toString(),
  );

  if (!applyVisaServices)
    throw new AppError(StatusCodes.NOT_FOUND, "Visa Service not found");

  const activeApplication =
    await VisaApplicationRepository.findActiveApplication(
      payload.userId.toString(),
      payload.visaServiceId.toString(),
    );

  if (activeApplication) {
    throw new Error(
      "You already have a pending or processing visa application.",
    );
  }

  const visaFee = applyVisaServices.visaFee || 0;
  const serviceFee = applyVisaServices.serviceFee || 0;

  payload.visaFee = visaFee;
  payload.serviceFee = serviceFee;
  payload.totalFee = visaFee + serviceFee;

  // 🔥 USER CURRENCY
  const userCurrency = await getUserCurrency(payload.userId.toString());

  // 🔥 convert income → USD
  if (payload.monthlyIncome) {
    payload.monthlyIncome = await convertToUSD(
      payload.monthlyIncome,
      userCurrency,
    );
  }
  const created = await VisaApplicationRepository.create(payload);
  // ✅ Activity Log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(payload.userId),
    actorRole: Role.USER,
    action: "CREATE_VISA_APPLICATION",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(created._id),
    message: `User applied for visa (serviceId: ${payload.visaServiceId})`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  // ✅ Notification
  await NotificationService.sendNotification({
    userId: payload.userId.toString(),
    title: "Visa Application Submitted",
    message: "Your visa application has been successfully submitted",
   type: NotificationType.APPLICATION_SUBMITTED,
    metadata: { applicationId: created._id },
  });

  return created;
};

const updateApplication = async (
  id: string,
  payload: Partial<IVisaApplication>,
) => {
  // Fetch application first
  const application = await VisaApplicationRepository.findById(id);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  // Update it
  const updated = await VisaApplicationRepository.updateById(id, payload);

  // Send notification to the user
  await NotificationService.sendNotification({
    userId: application.userId.toString(),
    title: "Application Updated",
    message: "Your visa application info has been updated",
    type: "APPLICATION_UPDATED",
  });

  // ✅ Activity log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(application.userId), // Or actorId if you know who updated it
    actorRole: Role.MANAGER, // Or dynamically set based on updater
    action: "UPDATE_APPLICATION",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(application._id),
    message: `Application updated`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  return updated;
};

const getMyApplications = async (userId: string, queryParams: any) => {
  const userCurrency = await getUserCurrency(userId);

  // 🔥 ONLY ONE RATE FETCH (SAFE)
  const rate = (await getCurrencyRate(userCurrency)) ?? 1;

  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .find({ userId })
      .populate("visaServiceId")
      .populate("countryId")
      .populate("assignedTo", "name email role"),
    queryParams,
  )
    .search(["status", "visaType"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await query.build();

  const convert = (amount: number) => {
    if (!amount) return 0;
    if (userCurrency === "USD") return amount;

    return Number((amount * rate).toFixed(2)); // 🔥 rounding added
  };

  const convertedData = result.data.map((app: any) => {
    let visaService = app.visaServiceId;

    if (visaService) {
      visaService = {
        ...visaService.toObject(),
        visaFee: convert(visaService.visaFee),
        serviceFee: convert(visaService.serviceFee),
        totalFee: convert(visaService.totalFee),
        currency: userCurrency,
      };
    }

    return {
      ...app.toObject(),

      visaFee: convert(app.visaFee),
      serviceFee: convert(app.serviceFee),
      totalFee: convert(app.totalFee),

      monthlyIncome: convert(app.monthlyIncome),

      visaServiceId: visaService,

      currency: userCurrency,
    };
  });

  return {
    data: convertedData,
    meta: result.meta,
  };
};

const getAllApplication = async (queryParams: any) => {
  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .populate("userId")
      .populate("visaServiceId")
      .populate("countryId"),
    queryParams,
  )
    .search(["status"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await query.build();

  return result;
};

const getOneForManager = async (id: string) => {
  const result = await VisaApplicationRepository.findById(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return result;
};

const updateStatus = async (id: string, status: ApplicationStatus) => {
  // ✅ Validate status
  if (!Object.values(ApplicationStatus).includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status value");
  }

  const application = await VisaApplicationRepository.findById(id);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  const updated = await VisaApplicationRepository.updateById(id, { status });

  if (!updated) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  // 🔔 Send notification to assigned manager (if assigned)
  if (application.assignedTo) {
    try {
      await NotificationService.sendNotification({
        userId: application.assignedTo.toString(),
        title: "Visa Application Status Updated",
        message: `Application #${application._id} status updated to ${status}`,
        type: "APPLICATION_STATUS_UPDATE",
        metadata: { applicationId: application._id, newStatus: status },
      });
    } catch (err) {
      console.error("Failed to send status update notification:", err);
    }
  }
  const actorId = application.assignedTo
    ? application.assignedTo
    : application.userId;
  // ✅ Activity Log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(actorId),
    actorRole: Role.MANAGER,
    action: "UPDATE_APPLICATION_STATUS",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(application._id),
    message: `Application status updated to ${status}`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });
  return updated;
};

const assignApplication = async (
  applicationId: string,
  managerId: string,
  assignedById: string,
) => {
  // ✅ Validate ObjectId
  if (
    !Types.ObjectId.isValid(applicationId) ||
    !Types.ObjectId.isValid(managerId)
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const application = await VisaApplicationRepository.findById(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  }

  // ❌ Already assigned to someone
  if (application.assignedTo) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Application already assigned to a manager",
    );
  }

  // ❌ Cannot assign completed application
  if (
    application.status === ApplicationStatus.APPROVED ||
    application.status === ApplicationStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot assign completed application",
    );
  }

  // ✅ Check manager exists & role
  const manager = await userRepository.findById(managerId);

  if (!manager || manager.role !== Role.MANAGER) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid manager");
  }

  // ✅ Assign only once
  application.assignedTo = new Types.ObjectId(managerId);
  application.status = ApplicationStatus.PROCESSING;

  application.assignmentHistory = [
    {
      assignedBy: new Types.ObjectId(assignedById),
      assignedTo: new Types.ObjectId(managerId),
      assignedAt: new Date(),
    },
  ];

  await application.save();
  // ✅ Activity Log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(assignedById),
    actorRole: Role.ADMIN,
    action: "ASSIGN_APPLICATION",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(applicationId),
    message: `Application assigned to manager ${managerId}`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  // 🔔 Notify manager
  await NotificationService.sendNotification({
    userId: managerId,
    title: "New Application Assigned",
    message: `You have been assigned application #${applicationId}`,
    type: "APPLICATION_ASSIGNMENT",
    metadata: { applicationId },
  });

  return await VisaApplicationRepository.findByIdWithPopulate(applicationId);
};

const getOneApplicationForAdmin = async (applicationId: string) => {
  // ✅ Validate ObjectId
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Application ID");
  }

  // ✅ Find the application with populated references
  const application =
    await VisaApplicationRepository.findByIdWithPopulate(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Visa application not found");
  }

  return application;
};

const getMyAssignedApplications = async (
  managerId: string,
  queryParams: any,
) => {
  const query = new QueryBuilder(
    VisaApplicationRepository.findAll()
      .find({ assignedTo: managerId })
      .populate("userId")
      .populate("visaServiceId")
      .populate("countryId"),
    queryParams,
  )
    .search(["status"])
    .filter()
    .sort()
    .paginate()
    .fields();

  return await query.build();
};

const applicationUpdateByManager = async (
  applicationId: string,
  managerId: string,
  payload: Partial<IVisaApplication>,
) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Application ID");
  }

  const application = await VisaApplicationRepository.findById(applicationId);

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Application not found");
  }

  // ❌ Not assigned
  if (!application.assignedTo) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Application not assigned yet");
  }

  // ❌ Not his application
  if (application.assignedTo.toString() !== managerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to edit this application",
    );
  }

  // ❌ Completed হলে edit না
  if (
    application.status === ApplicationStatus.APPROVED ||
    application.status === ApplicationStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot edit completed application",
    );
  }

  const updated = await VisaApplicationRepository.updateById(
    applicationId,
    payload,
  );

  // ✅ Activity Log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(managerId),
    actorRole: Role.MANAGER,
    action: "MANAGER_UPDATE_APPLICATION",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(applicationId),
    message: `Manager updated application তথ্য`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  return updated;
};

const deleteVisaApplication = async (id: string) => {
  const deleted = await VisaApplicationRepository.deleteById(id);

  if (!deleted)
    throw new AppError(StatusCodes.NOT_FOUND, "visa application not found");
  await VisaApplicationRepository.deleteById(id);

  // ✅ Activity Log
  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(deleted.userId),
    actorRole: Role.USER,
    action: "DELETE_APPLICATION",
    entityType: "VisaApplication",
    entityId: new Types.ObjectId(id),
    message: `Visa application deleted`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  return deleted;
};
export const VisaApplicationService = {
  createVisaApplication,
  updateApplication,
  getMyApplications,
  getAllApplication,
  getOneForManager,
  updateStatus,
  deleteVisaApplication,
  assignApplication,
  getMyAssignedApplications,
  applicationUpdateByManager,
  getOneApplicationForAdmin,
};
