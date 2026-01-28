import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import notFound from "./app/middlewares/notFound.js";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
const app: Application = express();

// Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors());

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "Visa Bot API is running 🚀" });
});

// TODO: add routes later
// app.use("/api/v1/auth", authRoutes);

// Not Found + Global Error
app.use(notFound);
app.use(globalErrorHandler);

export default app;
