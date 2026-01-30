import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { envVar } from "./app/config/EnvVar";
import { router } from "./app/routes";
import passport from "./app/config/passport.config";

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// recommended: set real origins later (not true)
app.use(
  cors({
    origin: envVar.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// ✅ health endpoints
app.get("/health/live", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Alive ✅" });
});

app.get("/health/ready", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Ready ✅",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// TODO: routes
app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
