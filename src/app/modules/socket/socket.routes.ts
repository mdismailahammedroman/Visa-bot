import { Router } from "express";
import { socketNotification } from "./socket.controller";

const router = Router();

router.post("/notify", socketNotification);

export const socketRouter = router;
