import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../helpers/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { registerUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";

export const router = Router();
router.post(
  "/register",
  validateRequest(registerUserZodSchema),
  userController.registerUser,
);

router.patch(
  "/update-user",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser,
);
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  userController.getByMySelf,
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER, Role.MANAGER),
  userController.getAllUsers,
);

router.get(
  "/profile/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.getUserProfileByIdForAdmin,
);

router.patch(
  "/status/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.setUserStatus,
);

router.patch(
  "/role/:userId",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  userController.setUserRole,
);

router.delete(
  "/delete-account",
  checkAuth(...Object.values(Role)),
  userController.deleteMyAccount,
);

export const userRouter = router;
