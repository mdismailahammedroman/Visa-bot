import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";
import { feedbackController } from "./feedback.controller";

const router = Router();

/* =====================================================
   USER ROUTES
===================================================== */

// Submit feedback
router.post("/submit", checkAuth(Role.USER), feedbackController.submitFeedback);

// Get logged-in user's feedback
router.get(
  "/my-feedback",
  checkAuth(Role.USER,),
  feedbackController.getMyFeedback,
);

/* =====================================================
   ADMIN ROUTES
===================================================== */

// Get all feedback
router.get("/", checkAuth(Role.ADMIN), feedbackController.getAllFeedback);

// Get feedback by visa application
router.get(
  "/:feadbackId",
  checkAuth(Role.ADMIN),
  feedbackController.getFeedbackByVisaApplication,
);

// Delete feedback
router.delete(
  "/delete/:id",
  checkAuth(Role.USER, Role.ADMIN),
  feedbackController.deleteFeedback,
);

export const feedbackRoute = router;
