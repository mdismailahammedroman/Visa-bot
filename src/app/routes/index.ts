import { Router } from "express";

import { countryRouter } from "../modules/country/country.routes";
import { authRouter } from "../modules/auth/auth.route";
import { otpRouter } from "../modules/Otp/otp.route";
import { userRouter } from "../modules/user/user.route";
import { visaServiceRouter } from "../modules/visaService/visaService.route";
import { visaApplicationRoute } from "../modules/visaApply/visa.route";
import { notificationRoute } from "../modules/notification/notification.route";
import { visaPaymentRouter } from "../modules/visaPayment/payment.route";
// import { chatRoute } from "../modules/chat/chat.route";

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
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path:"/payment",
    route:visaPaymentRouter,
  },
  // {
  //   path: "/chat",
  //   route: chatRoute,
  // },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
