import { Router } from "express";
import authRoutes from "./auth.Routes.js";
import userRoutes from "./user.Routes.js";
import categoryRoute from "./category.Routes.js";

const router = Router();

//Route for auth
router.use("/auth", authRoutes);

//Route for user
router.use("/user", userRoutes);

//Route for Category
router.use("/category", categoryRoute);
export default router;
