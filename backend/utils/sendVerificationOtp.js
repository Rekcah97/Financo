import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

export const sendVerificationOTP = async (id, email) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const mailFormat = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the Financo application to verify your Email Address And complete the verification process.</p><p>The OTP will expire in <b>1 Hour</b>.</p>`,
    };

    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.verificationCode.create({
      data: {
        code: hashedOtp,
        userId: id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await transporter.sendMail(mailFormat);

    return { success: true };
  } catch (err) {
    console.log("Error in sending verification code", err);
    return { success: false };
  }
};
