import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createSavingGoal,
  deleteSavingGoal,
} from "../controllers/savingGoals.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createSavingGoal);

//Route 2
router.delete("/delete/:sId", verifyJWT, deleteSavingGoal);

export default router;
