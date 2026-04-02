/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../ErrorHelpers/AppError";
import {
  IUser,
  Role,
  TCreateUserPayload,
  TUpdateUserProfile,
  UserStatus,
} from "./user.interface";
import { userRepository } from "./user.repository";
import { hashPassword } from "../../helpers/passwordHelper";
import { otpService } from "../Otp/otp.service";
import { QueryParams } from "../../utils/queryBuilder";
import { ActivityLogService } from "../activity/activityLog.service";
import { NotificationService } from "../notification/notification.service";
import { Types } from "mongoose";
import { NotificationType } from "../notification/notification.interface";

const registerUser = async (payload: TCreateUserPayload) => {
  const existingUser = await userRepository.findByEmail(payload.email);
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "Email already in use");
  }

  const passwordHash = await hashPassword(payload.password);

  const newUser = await userRepository.register({
    ...payload,
    password: passwordHash,
  });
  if (payload.fcmToken) {
    await userRepository.addFCMToken(newUser._id, payload.fcmToken);
  }
  await otpService.sendOtp(newUser.email, "NEW_USER_VERIFY", newUser.name);

   // --- Parallel log + notification ---
  await Promise.all([
    ActivityLogService.logActivity({
      actorId: new Types.ObjectId(newUser._id),
      actorRole: newUser.role,
      action: "REGISTER",
      entityType: "User",
      entityId: new Types.ObjectId(newUser._id),
      message: `User ${newUser.email} registered`,
      status: "SUCCESS",
      ip: "",
      userAgent: "",
    }),
  ]);


  return newUser;
};

const updateUser = async (
  userId: string,
  update: Partial<TUpdateUserProfile>,
  file?: Express.MulterS3.File,
) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if user is verified
  if (!user.is_verified) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not verified");
  }

  // Check if user status is ACTIVE
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not active");
  }

  // If file uploaded, update profile picture URL

if (file) {
  if (file.fieldname === "profile_picture") {
    update.profile_picture = file.location;
  } else if (file.fieldname === "coverPicture") {
    update.coverPicture = file.location;
  }
}
  const updatedUser = await userRepository.updateUser(userId, update);

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User update failed");
  }

await Promise.all([
  ActivityLogService.logActivity({
    actorId: new Types.ObjectId(updatedUser._id), // <-- ObjectId enforced
    actorRole: updatedUser.role,
    action: "UPDATE_USER",
    entityType: "User",
    entityId: new Types.ObjectId(updatedUser._id), // <-- ObjectId enforced
    message: `User ${updatedUser.email} info updated`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  }),
  NotificationService.sendNotification({
    userId: updatedUser._id.toString(), // string ok here
    title: "Profile Updated",
    message: `User ${updatedUser.email} updated profile information`,
    type: NotificationType.SYSTEM_UPDATE,
  }),
]);
  
  return updatedUser;
};

const getByMySelf = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not Found");
  }
  // Check if user is verified
  if (!user.is_verified) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not verified");
  }

  // Check if user status is ACTIVE
  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User is not active");
  }

  user.password = undefined as any;

  return user;
};

const getAllUsersForAdmin = async (
  queryParams: QueryParams,
): Promise<{ data: IUser[]; meta: any }> => {
  const usersWithMeta = await userRepository.getAllUsersWithQuery(queryParams);
  return {
    data: usersWithMeta.data,
    meta: usersWithMeta.meta,
  };
};

const getUserProfileForAdmin = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    mobile: user.mobile,
    location: user.location,

    profile_picture: user.profile_picture,
    coverPicture: user.coverPicture,

    status: user.status,
    role: user.role,

    memberSince: user.createdAt,
    lastLogin: user.lastLoginAt,

    accountActions: {
      canResetPassword: true,
      canDeleteAccount: true,
      canBlockUser: true,
    },
  };
};

const changeUserStatus = async (
  adminUser: IUser,
  userId: string,
  status: UserStatus,
) => {
  // Only admins can change status
  if (![Role.MAIN_MANAGER, Role.ADMIN].includes(adminUser.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admins can change user status",
    );
  }

  const user = await userRepository.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await userRepository.updateUser(userId, { status });

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User update failed");
  }

  // --- Activity Log ---
await Promise.all([
  ActivityLogService.logActivity({
    actorId: new Types.ObjectId(adminUser._id),
    actorRole: adminUser.role,
    action: "UPDATE_USER_STATUS",
    entityType: "User",
    entityId: new Types.ObjectId(updatedUser._id),
    message: `Admin ${adminUser.email} changed status of ${updatedUser.email} to ${status}`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  }),
  NotificationService.sendNotification({
    userId: updatedUser._id.toString(),
    title: "Profile Updated",
    message: `Admin ${adminUser.email} changed status of ${updatedUser.email} to ${status}`,
    type: NotificationType.SYSTEM_UPDATE,
  }),
]);
  return updatedUser;
};

const changeUserRole = async (adminUser: IUser, userId: string, role: Role) => {
  // Only admins can change role
  if (![Role.ADMIN].includes(adminUser.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admins can change user role",
    );
  }

  const user = await userRepository.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const oldRole = user.role; // ✅ track previous role

  const updatedUser = await userRepository.updateUser(userId, { role });

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User update failed");
  }

  // --- Activity Log ---
await Promise.all([
  ActivityLogService.logActivity({
    actorId: new Types.ObjectId(adminUser._id),
    actorRole: adminUser.role,
    action: "CHANGE_USER_ROLE",
    entityType: "User",
    entityId: new Types.ObjectId(updatedUser._id),
    message: `Admin ${adminUser.email} changed role of ${updatedUser.email} from ${oldRole} to ${role}`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  }),
  NotificationService.sendNotification({
    userId: updatedUser._id.toString(),
    title: "Role Updated",
    message: `Your role has been changed from ${oldRole} to ${role}`,
    type: NotificationType.SYSTEM_UPDATE,
  }),
]);

  return updatedUser;
};

const deleteMyAccount = async (userId: string) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  await userRepository.deleteUserById(userId); // repository handles hard delete
  await ActivityLogService.logActivity({
  actorId: new Types.ObjectId(user._id),
  actorRole: user.role,
  action: "DELETE_ACCOUNT",
  entityType: "User",
  entityId: new Types.ObjectId(user._id),
  message: `User ${user.email} deleted account`,
  status: "SUCCESS",
});
  return null;
};


const deleteUserByAdmin = async (adminUser: IUser, userId: string) => {
  if (adminUser.role !== Role.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only admin can delete other user accounts",
    );
  }

  const targetUser = await userRepository.findById(userId);

  if (!targetUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // optional safety
  if (targetUser._id.toString() === adminUser._id.toString()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Use delete-account route to delete your own account",
    );
  }

  await userRepository.deleteUserById(userId);

  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(adminUser._id),
    actorRole: adminUser.role,
    action: "DELETE_USER",
    entityType: "User",
    entityId: new Types.ObjectId(targetUser._id),
    message: `Admin ${adminUser.email} deleted user ${targetUser.email}`,
    status: "SUCCESS",
    ip: "",
    userAgent: "",
  });

  return null;
};


const saveFCMToken = async (userId: string, fcmToken: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const fcmTokens = user.fcmTokens || [];

  // Avoid duplicate tokens
  if (!fcmTokens.includes(fcmToken)) {
    fcmTokens.push(fcmToken);
  }

  await userRepository.updateUser(userId, {
    fcmTokens,
  } as unknown as Partial<TUpdateUserProfile>);

  return fcmTokens;
};


// 🔔 Push toggle fixed with await
const togglePush = async (userId: string, enabled: boolean) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const result = await userRepository.updateUser(userId, {
    notificationSettings: { ...user.notificationSettings, push: enabled },
  });

  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(userId) ,
    actorRole: user.role,
    action: enabled ? "TOGGLE_PUSH_ON" : "TOGGLE_PUSH_OFF",
    entityType: "User",
    entityId: new Types.ObjectId(userId) ,
    message: `User ${user.email} turned push notifications ${enabled ? "ON" : "OFF"}`,
    status: "SUCCESS",
  });

  return result;
};

// 📧 Email toggle fixed
const toggleEmail = async (userId: string, enabled: boolean) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const result = await userRepository.updateUser(userId, {
    notificationSettings: { ...user.notificationSettings, email: enabled },
  });

  await ActivityLogService.logActivity({
    actorId: new Types.ObjectId(userId) ,
    actorRole: user.role,
    action: enabled ? "TOGGLE_EMAIL_ON" : "TOGGLE_EMAIL_OFF",
    entityType: "User",
    entityId: new Types.ObjectId(userId) ,
    message: `User ${user.email} turned email notifications ${enabled ? "ON" : "OFF"}`,
    status: "SUCCESS",
  });

  return result;
};

// export user services
export const userService = {
  registerUser,
  updateUser,
  getByMySelf,
  getAllUsersForAdmin,
  getUserProfileForAdmin,
  changeUserStatus,
  changeUserRole,
  deleteMyAccount,
  deleteUserByAdmin,
  saveFCMToken,
  toggleEmail,
  togglePush,
};
