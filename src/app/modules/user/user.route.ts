import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../helpers/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { registerUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { uploadSingle } from "../../middlewares/uploadS3";

export const router = Router();

// ✅ Register user
router.post(
  "/register",
  validateRequest(registerUserZodSchema),
  userController.registerUser,
);

// ✅ Update user profile (with profile picture upload)
router.patch(
  "/update-user",
  checkAuth(...Object.values(Role)),
  uploadSingle("profile_picture"),
  validateRequest(updateUserZodSchema),
  userController.updateUser,
);

// ✅ Get logged-in user profile
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  userController.getByMySelf,
);

// ✅ Get all users (admin/manager)
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER, Role.MANAGER, ),
  userController.getAllUsers,
);

// ✅ Get any user profile by ID (admin/manager)
router.get(
  "/profile/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.getUserProfileByIdForAdmin,
);

// ✅ Change user status (BLOCK, ACTIVE, SUSPENDED)
router.patch(
  "/status/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.setUserStatus,
);

// ✅ Change user role (ADMIN, MANAGER, USER)
router.patch(
  "/role/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.setUserRole,
);

// ✅ Delete own account
router.delete(
  "/delete-account",
  checkAuth(...Object.values(Role)),
  userController.deleteMyAccount,
);



export const userRouter = router;