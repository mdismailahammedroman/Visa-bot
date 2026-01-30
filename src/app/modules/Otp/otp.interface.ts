export interface OtpRecord {
  email: string;

  otpHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

export interface SendOtpPayload {
  email: string;

  name?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
