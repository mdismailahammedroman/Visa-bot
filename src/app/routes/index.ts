import { Router } from "express";
import { socketRouter } from "../modules/socket/socket.routes";

export const router = Router();

const routes = [
  {
    path: "/socket",
    route: socketRouter,
  },
];
routes.forEach((route) => {
  router.use(route.path, route.route);
});
