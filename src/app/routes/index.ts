import { Router } from "express";
import { socketRouter } from "../modules/socket/socket.routes";
import { countryRouter } from "../modules/country/country.routes";
import { authRouter } from "../modules/auth/auth.route";
import { otpRouter } from "../modules/Otp/otp.route";
import { userRouter } from "../modules/user/user.route";
import { visaServiceRouter } from "../modules/visaService/visaService.route";
import { visaApplicationRoute } from "../modules/visaApply/visa.route";

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
    path: "/visa",
    route: visaServiceRouter,
  },
  {
    path: "/apply-visa",
    route: visaApplicationRoute,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
