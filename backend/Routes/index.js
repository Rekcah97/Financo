import { Router } from "express";
import authRoutes from "./auth.Routes.js";
import userRoutes from "./user.Routes.js";
import categoryRoute from "./category.Routes.js";
import transactionRoute from "./transaction.Routes.js";
import savingGoalsRoute from "./savingGoals.Routes.js";

const router = Router();

//Route for auth
router.use("/auth", authRoutes);

//Route for user
router.use("/user", userRoutes);

//Route for Category
router.use("/category", categoryRoute);

//Route for transaction
router.use("/transaction", transactionRoute);

//Route for Saving Goals
router.use("/savingGoals", savingGoalsRoute);

//Route for Health
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    msg: "up",
  });
});

export default router;
