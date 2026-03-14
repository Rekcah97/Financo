import AppError from "../utils/AppError.utils.js";

export const notFound = async (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not Found`, 404);
  next(err);
};
