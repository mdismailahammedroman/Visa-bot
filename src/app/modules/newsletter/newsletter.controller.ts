/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { NewsletterService } from "./newsletter.service";
import { CatchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const subscribe = CatchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.subscribe(req.body.email, req.user);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Subscribed successfully",
    data: result,
  });
});

const unsubscribe = CatchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.unsubscribe(req.body.email, req.user);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Unsubscribed successfully",
    data: result,
  });
});

const getSubscribers = CatchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.getSubscribers();

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subscribers fetched",
    data: result,
  });
});

const createCampaign = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await NewsletterService.createCampaign(req.body, user);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Campaign created",
    data: result,
  });
});

const sendCampaign = CatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await NewsletterService.sendCampaign(id as string, user);

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Campaign sent successfully",
    data: result,
  });
});

const getCampaigns = CatchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.getCampaigns();

  return sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Campaigns fetched",
    data: result,
  });
});

export const NewsletterController = {
  subscribe,
  unsubscribe,
  getSubscribers,
  createCampaign,
  sendCampaign,
  getCampaigns,
};
