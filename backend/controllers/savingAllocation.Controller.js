import prisma from "../config/db.config.js";

export const allocateAmount = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { amount, sId } = req.body;

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

    await prisma.$transaction(async (transaction) => {
      const numericAmount = Number(amount);

      const allocate = await transaction.savingAllocation.create({
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
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
    console.log(allocation);
    if (!allocation) {
      return res.status(404).json({
        success: false,
        msg: "Allocation doesnot exist or has been deleted",
      });
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.savingAllocation.delete({
        where: {
          id: aId,
        },
      });
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
