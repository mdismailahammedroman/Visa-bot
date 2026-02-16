import { Router } from "express";
import { socketRouter } from "../modules/socket/socket.routes";
import { countryRouter } from "../modules/country/country.routes";
import { authRouter } from "../modules/auth/auth.route";
import { otpRouter } from "../modules/Otp/otp.route";
import { userRouter } from "../modules/user/user.route";

export const router = Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/otp",
    route: otpRouter,
  },
  {
    path: "/socket",
    route: socketRouter,
  },
  {
    path: "/country",
    route: countryRouter,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
