import prisma from "../config/db.config.js";

//Route 1
export const createTransaction = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const { amount, note, date, catId } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Amount cannot be less than 0 or empty" });
    }

    const category = await prisma.category.findFirst({
      where: {
        id: Number(catId),
        userId,
      },
    });

    if (!category) {
      return res
        .status(400)
        .json({ success: false, msg: "category doesnot exist" });
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error", err });
  }
};

//Route 2
export const deleteTransaction = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        msg: "Transaction doesnt exist or has been deleted",
      });
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
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};
