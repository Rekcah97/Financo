import prisma from "../config/db.config.js";

export const cleanupExpiredEntries = async (req, res) => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    console.log(`Cleaned up ${result.count} expired Refersh Token`);
  } catch (err) {
    console.log("Error in cleaning up Expired Entires");
  }
};
