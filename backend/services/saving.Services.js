import prisma from "../config/db.config.js";

export const totalSavingMoney = async (userId) => {
  const totalAmount = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      category: { type: "saving" },
    },
  });

  return totalAmount._sum.amount || 0;
};
