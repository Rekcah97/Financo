import prisma from "../config/db.config.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

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
