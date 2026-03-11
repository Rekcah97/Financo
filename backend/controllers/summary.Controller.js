import prisma from "../config/db.config.js";
import {
  totalSavingMoney,
  allocatedSavingMoney,
  unallocatedSavingMoney,
} from "../services/saving.Services.js";

export const summaryDetails = async (req, res) => {
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

    const saving = await totalSavingMoney(userId);

    const incomeAmount = income._sum.amount ?? 0;
    const expenseAmount = expense._sum.amount ?? 0;
    const savingAmount = saving;

    return res
      .status(200)
      .json({ success: true, incomeAmount, expenseAmount, savingAmount });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

export const balanceDetails = async (req, res) => {
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

export const summaryDetailsbyDate = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ success: false, msg: "Start and end are requireds" });
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};
