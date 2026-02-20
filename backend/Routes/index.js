import { Router } from "express";
import authRoutes from "./auth.Routes.js";
import userRoutes from "./user.Routes.js";

const router = Router();

//Route for auth
router.use("/auth", authRoutes);

//Route for user
router.use("/user", userRoutes);
export default router;
