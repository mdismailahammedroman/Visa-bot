import bcrypt from "bcrypt";
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const verifyOTP = (generatedOTP: string, givenOTP: string) =>
  generatedOTP === givenOTP;

export const hashOtp = async (otp: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
};
