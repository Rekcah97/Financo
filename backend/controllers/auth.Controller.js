import prisma from "../config/db.config.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationOTP } from "../utils/sendVerificationOtp.utils.js";
import AppError from "../utils/AppError.utils.js";

const timeFor1Day = 24 * 60 * 60 * 1000;
const oneDayfromNow = Date.now() + timeFor1Day;
//Route 1
export const createUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const appErr = new AppError("Validation failed", 422);
    appErr.errors = error.array();
    return next(appErr);
  }
  try {
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return next(new AppError("User already exist", 409));
    }

    const saltAmount = 10;
    const secPassword = await bcrypt.hash(password, saltAmount);

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
    const payload = {
      id: newUser.id,
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
        expiresAt: new Date(oneDayfromNow),
      },
    });

    const inisiateVerification = await sendVerificationOTP(
      newUser.id,
      newUser.email,
    );

    if (inisiateVerification.success === false) {
      return next(new AppError("Internal Server Error", 500));
    }

    return res.status(201).json({ success: true, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

//Route 2
export const loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const appErr = new AppError("Validation failed", 422);
    appErr.errors = error.array();
    return next(appErr);
  }
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new AppError("User doesnot exist.Signup", 404));
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return next(new AppError("Login with correct credintial", 401));
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
        expiresAt: new Date(oneDayfromNow),
      },
    });
    return res.status(200).json({ success: true, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

//Route 3
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError("refresh token not found", 400));
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!storedToken) {
      return next(new AppError("Invalid Token", 401));
    }

    if (storedToken.expiresAt < Date.now()) {
      await prisma.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      return next(new AppError("Token Expired", 401));
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
        expiresAt: new Date(oneDayfromNow),
      },
    });

    return res
      .status(201)
      .json({ success: true, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

//Route 4
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError("token not found", 400));
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
    next(err);
  }
};

//Route 5
export const verifyEmail = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { otp } = req.body;

    if (!otp) {
      return next(new AppError("otp cannot be empty", 400));
    }

    const otpDetails = await prisma.verificationCode.findFirst({
      where: {
        userId,
      },
    });

    if (!otpDetails) {
      return next(
        new AppError(
          "account record doesnt exist or account is already verified",
          404,
        ),
      );
    }

    const isExpired = otpDetails.expiresAt.getTime() <= Date.now();

    if (isExpired) {
      await prisma.verificationCode.delete({
        where: {
          id: otpDetails.id,
        },
      });
      return next(new AppError("OTP is expired", 400));
    }
    const compareOTP = await bcrypt.compare(otp, otpDetails.code);

    if (!compareOTP) {
      return next(new AppError("incorrect OTP", 400));
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
    next(err);
  }
};

//Route 6
export const resentVerificationCode = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { email } = req.body;

    await prisma.verificationCode.deleteMany({
      where: {
        userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user.verified) {
      return next(
        new AppError("user is already verified. Try logging in", 400),
      );
    }

    const resentCode = await sendVerificationOTP(userId, email);

    if (!resentCode.success) {
      return next(new AppError("Internal Server Error", 500));
    }

    return res.status(200).json({
      success: true,
      msg: "Verification code has been sent to your id",
    });
  } catch (err) {
    next(err);
  }
};
