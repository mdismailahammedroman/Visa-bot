import { Router } from "express";
import { NewsletterController } from "./newsletter.controller";
import { validateRequest } from "../../helpers/validateRequest";
import { subscribeSchema, campaignSchema } from "./newsletter.validation";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/subscribe",
  validateRequest(subscribeSchema),
  NewsletterController.subscribe
);

router.post(
  "/unsubscribe",
  validateRequest(subscribeSchema),
  NewsletterController.unsubscribe
);

router.get(
  "/subscribers",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  NewsletterController.getSubscribers
);

router.post(
  "/campaign",
  checkAuth(Role.ADMIN, Role.MAIN_MANAGER),
  validateRequest(campaignSchema),
  NewsletterController.createCampaign
);

router.post(
  "/campaign/send/:id",
  checkAuth(Role.USER, Role.MAIN_MANAGER),
  NewsletterController.sendCampaign
);

router.get(
  "/campaigns",
  checkAuth(Role.USER, Role.MAIN_MANAGER),
  NewsletterController.getCampaigns
);

export const newsletterRouter = router;