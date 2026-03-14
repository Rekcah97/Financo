import prisma from "../config/db.config.js";
import { unallocatedSavingMoney } from "../services/saving.Services.js";
import AppError from "../utils/AppError.utils.js";

export const allocateAmount = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { amount, sId } = req.body;
    const numericAmount = Number(amount);

    const goal = await prisma.savingGoals.findFirst({
      where: {
        userId,
        id: Number(sId),
      },
    });

    if (!goal) {
      return next(new AppError("goal doesnot exist", 404));
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return next(new AppError("amount must be greater than 0", 400));
    }

    await prisma.$transaction(async (transaction) => {
      const allocatedAmountForCurrentGoal =
        await transaction.savingAllocation.aggregate({
          _sum: { amount: true },
          where: {
            sId: Number(sId),
          },
        });

      const numericAllocatedAmount = Number(
        allocatedAmountForCurrentGoal._sum.amount ?? 0,
      );

      const requiredAmount = goal.targetAmount - numericAllocatedAmount;
      if (numericAmount > requiredAmount) {
        throw new AppError(
          "amount cannot be greater than required amount for current goal",
          400,
        );
      }
      const unallocatedAmount = Number(await unallocatedSavingMoney(userId));

      if (numericAmount > unallocatedAmount) {
        throw new AppError("Not enough unallocated saving money", 400);
      }

      await transaction.savingAllocation.create({
        data: {
          sId: Number(sId),
          userId,
          amount: numericAmount,
        },
      });
    });

    return res.status(200).json({
      success: true,
      msg: `${amount} added to the goal with id ${sId}`,
    });
  } catch (err) {
    next(err);
  }
};

//Route 2

export const deleteAllocation = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const aId = Number(req.params.aId);

    const allocation = await prisma.savingAllocation.findFirst({
      where: {
        userId,
        id: aId,
      },
    });

    if (!allocation) {
      return next(
        new AppError("Allocation doesnot exist or has been deleted", 404),
      );
    }

    await prisma.savingAllocation.delete({
      where: {
        id: aId,
      },
    });

    return res.status(200).json({
      success: true,
      msg: `${aId} allocation to ${allocation.sId} saving goal has been deleted`,
    });
  } catch (err) {
    next(err);
  }
};

//Route 3

export const fetchAllocations = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const allocations = await prisma.savingAllocation.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({ success: true, allocations });
  } catch (err) {
    next(err);
  }
};
