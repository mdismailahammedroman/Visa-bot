/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "chat.log");

export const logChatEvent = (event: string, payload: any) => {

  const entry = {
    time: new Date().toISOString(),
    event,
    payload,
  };

  fs.appendFile(
    logFile,
    JSON.stringify(entry) + "\n",
    (err) => {
      if (err) {
        console.error("Chat log error:", err);
      }
    }
  );
};