import prisma from "../config/db.config.js";

export const cleanupExpiredEntries = async (req, res) => {
  try {
    const result1 = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    const result2 = await prisma.verificationCode.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    console.log(
      `Cleaned up ${result1.count} expired Refersh Token and ${result2.count} expired verification code`,
    );
  } catch (err) {
    console.log("Error in cleaning up Expired Entires");
  }
};
