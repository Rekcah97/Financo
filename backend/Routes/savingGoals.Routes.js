import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createSavingGoal,
  deleteSavingGoal,
  fetchGoals,
  goalProgress,
} from "../controllers/savingGoals.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createSavingGoal);

//Route 2
router.delete("/delete/:sId", verifyJWT, deleteSavingGoal);

//Route 3
router.get("/fetchSavingGoals", verifyJWT, fetchGoals);

//Route 4
router.get("/progress", verifyJWT, goalProgress);

export default router;
