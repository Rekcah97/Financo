import prisma from "../config/db.config.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    return res.status(200).json({ success: true, accessToken });
  } catch {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};
