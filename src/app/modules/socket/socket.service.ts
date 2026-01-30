import { getIo } from "../../config/socket";

export const notifyAllUsers = () => {
  const io = getIo();
  io.emit("notification", "Hello users 🚀");
};
