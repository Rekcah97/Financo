import prisma from "../config/db.config.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationOTP } from "../utils/sendVerificationOtp.js";

//Route 1
export const createUser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ success: false, error: error.array() });
  }
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exist " });
    }

    const secPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: secPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
      },
    });

    const inisiateVerification = await sendVerificationOTP(
      newUser.id,
      newUser.email,
    );

    if (inisiateVerification.success === false) {
      return res.status(500).json({
        success: false,
        msg: "Internal Server Error",
      });
    }
    return res.status(201).json({ success: true, newUser });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};

//Route 2
export const loginUser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ success: false, error: error.array() });
  }
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User doesnot exist.Signup" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(400)
        .json({ success: false, msg: "Login with correct credintial" });
    }

    const payload = {
      id: user.id,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};

//Route 3
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(404)
        .json({ success: false, msg: "refresh token not found" });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!storedToken || storedToken.expiresAt < Date.now()) {
      await prisma.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      return res.status(400).json({ success: false, msg: "Invalid Token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const payload = {
      id: decoded.id,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res
      .status(201)
      .json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};

//Route 4
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(404)
        .json({ success: false, msg: "refresh token not found" });
    }

    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    return res
      .status(200)
      .json({ success: true, msg: "Logged Out successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

//Route 5
export const verifyEmail = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { otp } = req.body;

    if (!otp) {
      return res
        .status(400)
        .json({ success: false, msg: "otp cannot be empty" });
    }

    const otpDetails = await prisma.verificationCode.findFirst({
      where: {
        userId,
      },
    });

    if (!otpDetails) {
      return res.status(404).json({
        success: false,
        msg: "account record doesnt exist or account is already verified",
      });
    }

    const isExpired = otpDetails.expiresAt.getTime() <= Date.now();

    if (isExpired) {
      await prisma.verificationCode.delete({
        where: {
          id: otpDetails.id,
        },
      });
      return res.status(400).json({
        success: false,
        msg: "OTP is expired",
      });
    }
    const compareOTP = await bcrypt.compare(otp, otpDetails.code);

    if (!compareOTP) {
      return res.status(400).json({ success: false, msg: "incorrect OTP" });
    }

    await prisma.verificationCode.delete({
      where: {
        id: otpDetails.id,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verified: true,
      },
    });

    return res.status(200).json({ success: true, msg: "Account verified" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};

//Route 6
export const resentVerificationCode = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { email } = req.body;

    await prisma.verificationCode.deleteMany({
      where: {
        userId,
      },
    });

    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.verified) {
      return res.status(400).json({
        success: false,
        msg: "user is already verified. Try logging in",
      });
    }

    const resentCode = await sendVerificationOTP(userId, email);

    if (!resentCode.success) {
      return res
        .status(500)
        .json({ success: false, msg: "Internal Server Error" });
    }

    return res.status(200).json({
      success: true,
      msg: "Verification code has been sent to your id",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};
