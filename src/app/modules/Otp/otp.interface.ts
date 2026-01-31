export type OtpPurpose = "NEW_USER_VERIFY" | "FORGOT_PASSWORD" | "VERIFY_EMAIL";

export interface OtpRecord {
  email: string;
  purpose: OtpPurpose;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

export interface SendOtpPayload {
  email: string;
  purpose: OtpPurpose;
  name?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}
