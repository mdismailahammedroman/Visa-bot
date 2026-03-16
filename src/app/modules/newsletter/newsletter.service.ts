/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../ErrorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { NewsletterRepository } from "./newsletter.repository";
import { transporter } from "../../utils/mail/mailer";
import { NotificationService } from "../notification/notification.service";


const subscribe = async (email: string) => {
  const existing = await NewsletterRepository.findSubscriberByEmail(email);

  if (existing && existing.status === "SUBSCRIBED") {
    throw new AppError(StatusCodes.CONFLICT, "Already subscribed");
  }

  if (existing) {
    return NewsletterRepository.updateSubscriber(email, {
      status: "SUBSCRIBED",
    });
  }

  return NewsletterRepository.createSubscriber({ email });
};

const unsubscribe = async (email: string) => {
  const existing = await NewsletterRepository.findSubscriberByEmail(email);

  if (!existing) {
    throw new AppError(StatusCodes.NOT_FOUND, "Subscriber not found");
  }

  return NewsletterRepository.updateSubscriber(email, {
    status: "UNSUBSCRIBED",
  });
};

const getSubscribers = async () => {
  return NewsletterRepository.findAllSubscribers();
};

const createCampaign = async (payload: any, userId: string) => {
  const campaign = await NewsletterRepository.createCampaign({
    ...payload,
    createdBy: userId,
  });

  await NotificationService.sendNotification({
    userId,
    title: "Newsletter Campaign Created",
    message: `Campaign "${campaign.title}" created successfully`,
    type: "NEWSLETTER",
    metadata: {
      campaignId: campaign._id,
    },
  });

  return campaign;
};

const sendCampaign = async (campaignId: string) => {
  const campaign = await NewsletterRepository.findCampaignById(campaignId);

  if (!campaign) {
    throw new AppError(StatusCodes.NOT_FOUND, "Campaign not found");
  }

  const subscribers = await NewsletterRepository.findSubscribedUsers();

  for (const sub of subscribers) {
    await transporter.sendMail({
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
//send noification


  return NewsletterRepository.updateCampaign(campaignId, {
    status: "SENT",
    sentAt: new Date(),
    totalRecipients: subscribers.length,
  });
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
