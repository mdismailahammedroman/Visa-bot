/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubscriberModel } from "./subscriber.model";
import { CampaignModel } from "./campaign.model";

const findSubscriberByEmail = (email: string) =>
  SubscriberModel.findOne({ email });

const createSubscriber = (payload: any) =>
  SubscriberModel.create(payload);

const updateSubscriber = (email: string, payload: any) =>
  SubscriberModel.findOneAndUpdate({ email }, payload, { new: true });

const findSubscribedUsers = () =>
  SubscriberModel.find({ status: "SUBSCRIBED" });

const findAllSubscribers = () => SubscriberModel.find();

const createCampaign = (payload: any) =>
  CampaignModel.create(payload);

const findCampaignById = (id: string) =>
  CampaignModel.findById(id);

const updateCampaign = (id: string, payload: any) =>
  CampaignModel.findByIdAndUpdate(id, payload, { new: true });

const findCampaigns = () => CampaignModel.find();

export const NewsletterRepository = {
  findSubscriberByEmail,
  createSubscriber,
  updateSubscriber,
  findSubscribedUsers,
  findAllSubscribers,
  createCampaign,
  findCampaignById,
  updateCampaign,
  findCampaigns,
};