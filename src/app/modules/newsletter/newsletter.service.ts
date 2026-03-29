/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { NewsletterRepository } from "./newsletter.repository";
import { sendEmail } from "../../utils/mail/mailer";
import { NotificationService } from "../notification/notification.service";
import { ActivityLogService } from "../activity/activityLog.service";
import { Types } from "mongoose";


const subscribe = async (email: string, user: any) => {
  const existing = await NewsletterRepository.findSubscriberByEmail(email);

  let result;

  if (existing && existing.status === "SUBSCRIBED") {
    throw new AppError(StatusCodes.CONFLICT, "Already subscribed");
  }

  if (existing) {
    result = await NewsletterRepository.updateSubscriber(email, {
      status: "SUBSCRIBED",
    });
  } else {
    result = await NewsletterRepository.createSubscriber({ email });
  }

  // 🔥 Activity Log
  await ActivityLogService.logActivity({
    actorId: user._id,
    actorRole: user.role,
    action: "SUBSCRIBE_NEWSLETTER",
    entityType: "Newsletter",
    entityId: user._id,
    message: `${email} subscribed to newsletter`,
    status: "SUCCESS",
  });

  return result;
};

const unsubscribe = async (email: string, user: any) => {
  const existing = await NewsletterRepository.findSubscriberByEmail(email);

  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Subscriber not found");
  }

  const result = await NewsletterRepository.updateSubscriber(email, {
    status: "UNSUBSCRIBED",
  });

  // 🔥 Activity Log
  await ActivityLogService.logActivity({
    actorId: user._id,
    actorRole: user.role,
    action: "UNSUBSCRIBE_NEWSLETTER",
    entityType: "Newsletter",
    entityId: user._id,
    message: `${email} unsubscribed from newsletter`,
    status: "SUCCESS",
  });

  return result;
};

const getSubscribers = async () => {
  return NewsletterRepository.findAllSubscribers();
};

const createCampaign = async (payload: any, user: any) => {
  const campaign = await NewsletterRepository.createCampaign({
    ...payload,
    createdBy: user._id,
  });

  await NotificationService.sendNotification({
    userId: user._id.toString(),
    title: "Newsletter Campaign Created",
    message: `Campaign "${campaign.title}" created successfully`,
    type: "NEWSLETTER",
    metadata: {
      campaignId: campaign._id,
    },
  });

  // 🔥 Activity Log
  await ActivityLogService.logActivity({
    actorId: user._id,
    actorRole: user.role,
    action: "CREATE_CAMPAIGN",
    entityType: "Newsletter",
    entityId: campaign._id,
    message: `Campaign created: ${campaign.title}`,
    status: "SUCCESS",
  });

  return campaign;
};

const sendCampaign = async (campaignId: string, user: any) => {
  const campaign = await NewsletterRepository.findCampaignById(campaignId);

  if (!campaign) {
    throw new AppError(StatusCodes.NOT_FOUND, "Campaign not found");
  }

  const subscribers = await NewsletterRepository.findSubscribedUsers();

  for (const sub of subscribers) {
    await sendEmail({
      to: sub.email,
      subject: campaign.subject,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>${campaign.title}</h1>
          <div>${campaign.content}</div>
        </div>
      `,
    });
  }

  const result = await NewsletterRepository.updateCampaign(campaignId, {
    status: "SENT",
    sentAt: new Date(),
    totalRecipients: subscribers.length,
  });

  // 🔥 Activity Log (VERY IMPORTANT)
  await ActivityLogService.logActivity({
    actorId: user._id,
    actorRole: user.role,
    action: "SEND_CAMPAIGN",
    entityType: "Newsletter",
    entityId: new Types.ObjectId(campaignId),
    message: `Campaign sent to ${subscribers.length} users`,
    status: "SUCCESS",
  });

  return result;
};

const getCampaigns = async () => {
  return NewsletterRepository.findCampaigns();
};

export const NewsletterService = {
  subscribe,
  unsubscribe,
  getSubscribers,
  createCampaign,
  sendCampaign,
  getCampaigns,
};
