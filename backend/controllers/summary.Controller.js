import prisma from "../config/db.config.js";
import {
  totalSavingMoney,
  allocatedSavingMoney,
  unallocatedSavingMoney,
} from "../services/saving.Services.js";
import AppError from "../utils/AppError.utils.js";

export const summaryDetails = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const income = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "income" } },
      },
    });

    const expense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "expense" } },
      },
    });

    const savingAmount = await totalSavingMoney(userId);
    const incomeAmount = income._sum.amount ?? 0;
    const expenseAmount = expense._sum.amount ?? 0;

    return res
      .status(200)
      .json({ success: true, incomeAmount, expenseAmount, savingAmount });
  } catch (err) {
    next(err);
  }
};

export const balanceDetails = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const totalSavingAmount = await totalSavingMoney(userId);
    const allocatedAmount = await allocatedSavingMoney(userId);
    const unallocatedAmount = await unallocatedSavingMoney(userId);

    return res.status(200).json({
      success: true,
      totalSavingAmount,
      allocatedAmount,
      unallocatedAmount,
    });
  } catch (err) {
    next(err);
  }
};

export const summaryDetailsbyDate = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { start, end } = req.query;

    if (!start || !end) {
      return next(new AppError("Start and end dates are requireds", 400));
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const income = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "income" } },
        date: { gte: startDate, lte: endDate },
      },
    });

    const expense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "expense" } },
        date: { gte: startDate, lte: endDate },
      },
    });

    const saving = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "saving" } },
        date: { gte: startDate, lte: endDate },
      },
    });

    const incomeAmount = income._sum.amount ?? 0;
    const expenseAmount = expense._sum.amount ?? 0;
    const savingAmount = saving._sum.amount ?? 0;

    return res
      .status(200)
      .json({ success: true, incomeAmount, expenseAmount, savingAmount });
  } catch (err) {
    next(err);
  }
};
