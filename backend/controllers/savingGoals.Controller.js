import prisma from "../config/db.config.js";

//Route 1
export const createSavingGoal = async (req, res) => {
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
      return res.status(400).json({
        success: true,
        msg: "saving goal with this name already exist",
      });
    }

    if (numericAmount < 0 || numericAmount == 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Target Amount must be greater than 0" });
    }

    const targetDate = new Date(deadline);

    const thirtyDatesFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const isValidDate = targetDate.getTime() >= thirtyDatesFromNow;

    if (!isValidDate) {
      return res
        .status(400)
        .json({ success: false, msg: "Date must be atleast 30 days from now" });
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

//Route 2

export const deleteSavingGoal = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        msg: "saving Goals doesnot exist or has been deleted",
      });
    }

    await prisma.savingGoals.delete({
      where: {
        id: sId,
      },
    });

    return res.status(200).json({ success: true, msg: "saving goals deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

//Route 3

export const fetchGoals = async (req, res) => {
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};
