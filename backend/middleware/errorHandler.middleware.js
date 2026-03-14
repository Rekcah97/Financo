import AppError from "../utils/AppError.utils.js";

export const errorHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    message,
    statusCode,
  });
};
