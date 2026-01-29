export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const verifyOTP = (generatedOTP: string, givenOTP: string) =>
  generatedOTP === givenOTP;
