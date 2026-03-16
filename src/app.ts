
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
import { visaPaymentController } from "./app/modules/visaPayment/payment.controller";
import { apiLimiter } from "./app/middlewares/rateLimiter";
import { requestLogger } from "./app/middlewares/requestLogger";

const app: Application = express();

/* =================================
   1️⃣ Security Headers
================================= */
app.use(helmet());

/* =================================
   2️⃣ Compression
================================= */
app.use(compression());

/* =================================
   3️⃣ HTTP Request Logging
================================= */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* =================================
   4️⃣ Trust Proxy
================================= */
app.set("trust proxy", 1);

/* =================================
   5️⃣ CORS
================================= */
app.use(
  cors({
    origin: envVar.FRONTEND_URL,
    credentials: true,
  })
);

/* =================================
   6️⃣ Stripe Webhook (RAW BODY)
   Must be before JSON parser
================================= */
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  visaPaymentController.stripeWebhookHandler
);

/* =================================
   7️⃣ Body Parsers
================================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =================================
   8️⃣ Cookie Parser
================================= */
app.use(cookieParser());

/* =================================
   9️⃣ Custom Request Logger
================================= */
app.use(requestLogger);

/* =================================
   🔟 Passport Authentication
================================= */
app.use(passport.initialize());

/* =================================
   1️⃣1️⃣ Rate Limiter
================================= */
app.use("/api", apiLimiter);

/* =================================
   1️⃣2️⃣ Health Check Endpoints
================================= */
app.get("/health/live", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Alive ✅",
  });
});

app.get("/health/ready", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Ready ✅",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =================================
   1️⃣3️⃣ API Routes
================================= */
app.use("/api/v1", router);

/* =================================
   1️⃣4️⃣ 404 Not Found Handler
================================= */
app.use(notFound);

/* =================================
   1️⃣5️⃣ Global Error Handler
================================= */
app.use(globalErrorHandler);

export default app;

