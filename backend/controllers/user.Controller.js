import prisma from "../config/db.config.js";

//Route 1
export const fetchUser = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        verified: true,
      },
    });

    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
