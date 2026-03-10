import prisma from "../config/db.config.js";
import { unallocatedSavingMoney } from "../services/saving.Services.js";

export const allocateAmount = async (req, res) => {
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
      return res
        .status(404)
        .json({ success: false, msg: "goal doesnot exist" });
    }
    if (numericAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, msg: "amount must be greater than 0" });
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

      console.log(numericAllocatedAmount);

      const requiredAmount = goal.targetAmount - numericAllocatedAmount;
      if (numericAmount > requiredAmount) {
        throw new Error(
          "amount cannot be greater than required amount for current goal",
        );
      }
      const unallocatedAmount = Number(await unallocatedSavingMoney(userId));

      if (numericAmount > unallocatedAmount) {
        throw new Error("Not enough unallocated saving money");
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
    if (
      err.message === "Not enough unallocated saving money" ||
      err.message ===
        "amount cannot be greater than required amount for current goal"
    ) {
      return res.status(400).json({ success: false, msg: err.message });
    } else {
      return res
        .status(500)
        .json({ success: false, msg: "Internal Server Error" });
    }
  }
};

//Route 2

export const deleteAllocation = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        msg: "Allocation doesnot exist or has been deleted",
      });
    }

    await prisma.savingAllocation.delete({
      where: {
        id: aId,
      },
    });

    return res.status(200).json({
      success: false,
      msg: `${aId} allocation to ${allocation.sId} saving goal has been deleted`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

//Route 3

export const fetchAllocations = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const allocations = await prisma.savingAllocation.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({ success: true, allocations });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, Msg: "Internal Server Error" });
  }
};
