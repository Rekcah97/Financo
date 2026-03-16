import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.utils.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return next(new AppError("invalid or empty token", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token Expired", 401));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    next(err);
  }
};
