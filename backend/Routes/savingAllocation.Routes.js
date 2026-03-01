import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  allocateAmount,
  deleteAllocation,
} from "../controllers/savingAllocation.Controller.js";

const router = Router();

//Route 1
router.post("/allocate", verifyJWT, allocateAmount);

//Route 2
router.delete("/delete/:aId", verifyJWT, deleteAllocation);

export default router;
