import prisma from "../config/db.config.js";

//Total Saving Calculation
export const totalSavingMoney = async (userId) => {
  try {
    const totalAmount = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        category: { is: { type: "saving" } },
      },
    });

    return totalAmount._sum.amount ?? 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//allocated money Calculation
export const allocatedSavingMoney = async (userId) => {
  try {
    const allocatedAmount = await prisma.savingAllocation.aggregate({
      _sum: { amount: true },
      where: {
        userId,
      },
    });

    return allocatedAmount._sum.amount ?? 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//unallocated money Calculation
export const unallocatedSavingMoney = async (userId) => {
  try {
    const totalAmount = await totalSavingMoney(userId);
    const allocatedAmount = await allocatedSavingMoney(userId);
    const unallocatedAmount = Math.max(0, totalAmount - allocatedAmount);

    return unallocatedAmount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
