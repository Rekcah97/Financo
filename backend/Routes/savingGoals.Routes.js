import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createSavingGoal,
  deleteSavingGoal,
  fetchGoals,
} from "../controllers/savingGoals.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createSavingGoal);

//Route 2
router.delete("/delete/:sId", verifyJWT, deleteSavingGoal);

//Route 3
router.get("/fetchSavingGoals", verifyJWT, fetchGoals);

export default router;
