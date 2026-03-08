/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ChatService } from "./chat.service";

const sendMessage = async (req: Request, res: Response) => {

  const user = req.user as any;

  if (!req.body.message) {
    throw new Error("Message is required");
  }

  const result = await ChatService.sendMessage(
    user._id,
    req.body.message
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const ChatController = {
  sendMessage,
};