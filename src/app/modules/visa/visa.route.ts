// src/modules/visa/visa.route.ts
import { Router } from "express";
import { VisaController } from "./visa.controller";

const router = Router();

router.post("/visa/start", VisaController.startVisaApplication);
router.patch("/visa/:visaId/step", VisaController.updateVisaStep);
router.get("/visa/:visaId", VisaController.getVisaApplication);

export default router;
