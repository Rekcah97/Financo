import prisma from "../config/db.config.js";

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
