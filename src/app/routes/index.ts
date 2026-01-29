import { Router } from "express";
import { socketRouter } from "../modules/socket/socket.routes";
import { countryRouter } from "../modules/country/countries.routes";
import { userRouter } from "../modules/user/user.route";

export const router = Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
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
