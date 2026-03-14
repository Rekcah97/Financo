import prisma from "../config/db.config.js";
import AppError from "../utils/AppError.utils.js";

//Route 1
export const createSavingGoal = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const { name, targetAmount, deadline } = req.body;

    const normaliseName = name.trim();
    const numericAmount = Number(targetAmount);

    const nameConflict = await prisma.savingGoals.findFirst({
      where: {
        userId,
        name: {
          equals: normaliseName,
          mode: "insensitive",
        },
      },
    });

    if (nameConflict) {
      return next(
        new AppError("saving goal with this name already exist", 409),
      );
    }

    if (numericAmount <= 0 || isNaN(numericAmount)) {
      return next(new AppError("Target Amount must be greater than 0", 400));
    }

    const targetDate = new Date(deadline);
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const thirtyDatesFromNow = Date.now() + THIRTY_DAYS_MS;

    const isValidDate = targetDate.getTime() >= thirtyDatesFromNow;

    if (!isValidDate) {
      return next(new AppError("Date must be atleast 30 days from now", 400));
    }

    await prisma.savingGoals.create({
      data: {
        name: normaliseName,
        targetAmount: numericAmount,
        userId,
        deadline: targetDate,
      },
    });

    return res.status(201).json({ success: true, msg: "saving goal created" });
  } catch (err) {
    next(err);
  }
};

//Route 2

export const deleteSavingGoal = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const sId = Number(req.params.sId);

    const goals = await prisma.savingGoals.findFirst({
      where: {
        userId,
        id: sId,
      },
    });

    if (!goals) {
      return next(
        new AppError("saving Goals doesnot exist or has been deleted", 404),
      );
    }

    await prisma.$transaction(async (transcation) => {
      await transcation.savingAllocation.deleteMany({
        where: {
          sId: sId,
        },
      });

      await transcation.savingGoals.delete({
        where: {
          id: sId,
        },
      });
    });

    return res.status(200).json({ success: true, msg: "saving goals deleted" });
  } catch (err) {
    next(err);
  }
};

//Route 3

export const fetchGoals = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const goals = await prisma.savingGoals.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({ success: true, goals });
  } catch (err) {
    next(err);
  }
};

//Route 4
export const goalProgress = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const goals = await prisma.savingGoals.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
    });

    const goalsWithAllocations = await Promise.all(
      goals.map(async (goal) => {
        const allocations = await prisma.savingAllocation.findMany({
          where: { sId: goal.id },
        });
        const totalAllocated = allocations.reduce(
          (sum, allocation) => sum + allocation.amount,
          0,
        );

        const percentage = ((totalAllocated / goal.targetAmount) * 100).toFixed(
          2,
        );
        return {
          ...goal,
          allocations,
          totalAllocated,
          percentage,
        };
      }),
    );

    return res.status(200).json({ success: true, goalsWithAllocations });
  } catch (err) {
    next(err);
  }
};
