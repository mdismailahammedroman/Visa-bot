import { Types } from "mongoose";

export interface INewsletterSubscriber {
  email: string;
  status: "SUBSCRIBED" | "UNSUBSCRIBED";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletterCampaign {
  title: string;
  subject: string;
  content: string;
  status: "DRAFT" | "SENT";
  createdBy: Types.ObjectId;
  sentAt?: Date;
  totalRecipients?: number;
  createdAt?: Date;
  updatedAt?: Date;
}