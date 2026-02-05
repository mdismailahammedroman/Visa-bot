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

export const userRouter = router;

// | # | Method | Endpoint                      | Auth Required | Description                |
// | - | ------ | ----------------------------- | ------------- | -------------------------- |
// | 1 | POST   | /api/v1/users/register        | No            | Register new user          |
// | 2 | POST   | /api/v1/users/login           | No            | Login user                 |
// | 3 | GET    | /api/v1/users/me              | Yes           | Get logged-in user profile |
// | 4 | PUT    | /api/v1/users/me              | Yes           | Update profile             |
// | 5 | POST   | /api/v1/users/change-password | Yes           | Change password            |
// | 6 | GET    | /api/v1/users                 | Yes (Admin)   | List all users             |
// | 7 | POST   | /api/v1/users/logout          | Yes           | Logout user                |
