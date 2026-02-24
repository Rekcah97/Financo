import { Router } from "express";
import authRoutes from "./auth.Routes.js";
import userRoutes from "./user.Routes.js";
import categoryRoute from "./category.Routes.js";
import transactionRoute from "./transaction.Routes.js";

const router = Router();

//Route for auth
router.use("/auth", authRoutes);

//Route for user
router.use("/user", userRoutes);

//Route for Category
router.use("/category", categoryRoute);

//Route for transaction
router.use("/transaction", transactionRoute);

export default router;
