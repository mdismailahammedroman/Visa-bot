import { Router } from "express";
import { socketRouter } from "../modules/socket/socket.routes";
import { countryRouter } from "../modules/country/country.routes";
import { authRouter } from "../modules/auth/auth.route";
import { otpRouter } from "../modules/Otp/otp.route";
import { userRouter } from "../modules/user/user.route";
import { visaServiceRouter } from "../modules/visaService/visaService.route";

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
  {
    path: "/visa-service",
    route: visaServiceRouter,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
