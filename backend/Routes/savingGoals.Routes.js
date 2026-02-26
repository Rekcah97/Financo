import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createSavingGoal } from "../controllers/savingGoals.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createSavingGoal);

export default router;
