import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.utils.js";

//Route 1
export const createTransaction = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const { amount, note, date, catId } = req.body;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return next(new AppError("Amount cannot be less than 0 or empty", 400));
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(catId),
        userId,
      },
    });

    if (!category) {
      return next(new AppError("category doesnot exist", 404));
    }

    await prisma.transaction.create({
      data: {
        note,
        date,
        amount: numericAmount,
        userId,
        catId: Number(catId),
      },
    });

    return res.status(201).json({ success: true, msg: "transaction created" });
  } catch (err) {
    next(err);
  }
};

//Route 2
export const deleteTransaction = async (req, res, next) => {
  try {
    const transactionId = Number(req.params.transactionId);
    const userId = Number(req.user.id);

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      return next(
        new AppError("Transaction doesnt exist or has been deleted", 404),
      );
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return res
      .status(200)
      .json({ success: true, msg: "Transaction deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//Route 3
export const fetchAllTransaction = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};
