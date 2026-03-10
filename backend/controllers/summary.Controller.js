import {
  allocatedSavingMoney,
  totalSavingMoney,
  unallocatedSavingMoney,
} from "../services/saving.Services.js";

export const summaryDetails = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const totalSavingAmount = await totalSavingMoney(userId);
    const allocatedAmount = await allocatedSavingMoney(userId);
    const unallocatedAmount = await unallocatedSavingMoney(userId);

    return res
      .status(200)
      .json({
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
