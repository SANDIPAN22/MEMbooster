import nodemailer from "nodemailer";
import { MAIL_SETUP } from "../config";
import VerificationTemplate from "../EmailTemplates/VerificationTemplate";
import { TransportOptions } from "nodemailer";

const transporter = nodemailer.createTransport(MAIL_SETUP as TransportOptions);

export const sendVerificationCode = async (
  email: string,
  name: string,
  otp: string,
) => {
  const mailBody = VerificationTemplate(name, otp);
  const mailSubject = "OTP for Account Verification";
  try {
    await transporter.sendMail({
      from: `No Reply <chak.sandipan22.secondary@gmail.com>`, // sender address
      to: email, // receiver email
      subject: mailSubject, // Subject line
      text: otp,
      html: mailBody,
    });
  } catch (e) {
    console.error("Something broke while sending the mail: ", e);
  }
};

export const sendPasswordResetCode = async () => {};
