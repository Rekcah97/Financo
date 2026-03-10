import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationOTP = async (id, email) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const oneHrFromNow = Date.now() + 60 * 60 * 1000;

    await prisma.verificationCode.create({
      data: {
        code: hashedOtp,
        userId: id,
        expiresAt: new Date(oneHrFromNow),
      },
    });

    const { data, error } = await resend.emails.send({
      from: "noreply@arpitregmi.com.np",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the Financo application to verify your Email Address And complete the verification process.</p><p>The OTP will expire in <b>1 Hour</b>.</p>`,
    });

    if (error) {
      console.log("Resend error:", error);
      return { success: false };
    }
    console.log("OTP email sent successfully", data);

    return { success: true };
  } catch (err) {
    console.log("Error in sending verification code", err);
    return { success: false };
  }
};
