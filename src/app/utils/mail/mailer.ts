import { envVar } from "../../config/EnvVar";
import { renderTemplate } from "./tamplate";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: envVar.SMTP.SMTP_HOST,
  port: Number(envVar.SMTP.SMTP_PORT),
  secure: false, // true for 465
  auth: {
    user: envVar.SMTP.SMTP_USER,
    pass: envVar.SMTP.SMTP_PASSWORD,
  },
});

export const sendOtpEmail = async ({
  to,
  name,
  otp,
}: {
  to: string;
  name: string;
  otp: string;
}) => {
  const html = renderTemplate("otp", {
    name,
    otp,
    appName: "VisaBot",
    expiry: 2,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: `"VisaBot" <${envVar.SMTP.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    html,
  });
};
