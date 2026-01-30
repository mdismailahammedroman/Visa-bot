import nodemailer from "nodemailer";
import { envVar } from "../../config/EnvVar";
import { renderTemplate } from "./tamplate";

export const transporter = nodemailer.createTransport({
  host: envVar.SMTP.SMTP_HOST, // smtp.gmail.com
  port: Number(envVar.SMTP.SMTP_PORT), // 465
  secure: true, // MUST be true for port 465
  auth: {
    user: envVar.SMTP.SMTP_USER, // full Gmail address
    pass: envVar.SMTP.SMTP_PASSWORD, // App Password
  },

  connectionTimeout: 10000,
});

export const sendOtpEmail = async ({
  to,
  name,
  otp,
  expiry,
}: {
  to: string;
  name: string;
  otp: string;
  expiry: number;
}) => {
  try {
    const html = renderTemplate("otp", {
      name,
      otp,
      expiry,
      appName: "VisaBot",
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: `"${envVar.SMTP.SMTP_FROM_NAME}" <${envVar.SMTP.SMTP_FROM_EMAIL}>`,
      to,
      subject: "Your OTP Code",
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Unable to send OTP email. Please try again later.");
  }
};
