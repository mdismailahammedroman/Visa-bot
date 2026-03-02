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
import { visaPaymentController } from "./app/modules/visaPayment/visaPayment.controller";
import rateLimit from "express-rate-limit";

const app: Application = express();

// 🛡 Security headers
app.use(helmet());

// 🏋️ Compression for faster response
app.use(compression());

// 📜 Request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 🏦 Rate Limiter (prevent abuse)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 🌐 CORS
app.use(
  cors({
    origin: envVar.FRONTEND_URL || "*",
    credentials: true,
  }),
);

// 📦 Parse requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔐 Passport auth
app.use(passport.initialize());

// 💳 Webhook route (Stripe example)
app.post(
  "/api/v1/apply-visa/webhook",
  express.raw({ type: "application/json" }),
  visaPaymentController.stripeWebhookHandler,
);

// 🩺 Health endpoints
app.get("/health/live", (_req: Request, res: Response) =>
  res.status(200).json({ success: true, message: "Alive ✅" }),
);
app.get("/health/ready", (_req: Request, res: Response) =>
  res
    .status(200)
    .json({
      success: true,
      message: "Ready ✅",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }),
);

// 🔗 API routes
app.use("/api/v1", router);

// ❌ 404 handler
app.use(notFound);

// ⚠️ Global error handler
app.use(globalErrorHandler);

export default app;
