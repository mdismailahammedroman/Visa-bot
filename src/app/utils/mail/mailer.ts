import nodemailer from "nodemailer";
import { envVar } from "../../config/EnvVar";
import { OtpPurpose } from "../../modules/Otp/otp.interface";
import { renderTemplate } from "./tamplate";

export const transporter = nodemailer.createTransport({
  host: envVar.SMTP.SMTP_HOST,
  port: Number(envVar.SMTP.SMTP_PORT),
  secure: true,
  auth: {
    user: envVar.SMTP.SMTP_USER,
    pass: envVar.SMTP.SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
});

export const sendOtpEmail = async ({
  to,
  name,
  otp,
  expiry,
  purpose,
}: {
  to: string;
  name: string;
  otp: string;
  expiry: number;
  purpose: OtpPurpose;
}) => {
  try {
    // Set email subject and description based on purpose
    let subject = "Your OTP Code";
    let description = "Use the following One-Time Password to continue:";

    if (purpose === "FORGOT_PASSWORD") {
      subject = "Reset your password";
      description = "Use the following OTP to reset your password:";
    } else if (purpose === "NEW_USER_VERIFY") {
      subject = "Verify your email";
      description = "Use the following OTP to verify your email:";
    } else if (purpose === "VERIFY_EMAIL") {
      subject = "Verify your email address";
      description = "Use the OTP below to verify your email:";
    }

    const html = renderTemplate("otp", {
      name,
      otp,
      expiry,
      appName: "VisaBot",
      year: new Date().getFullYear(),
      description, // pass description to template
    });

    await transporter.sendMail({
      from: `"${envVar.SMTP.SMTP_FROM_NAME}" <${envVar.SMTP.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Unable to send OTP email. Please try again later.");
  }
};
