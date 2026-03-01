import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  allocateAmount,
  deleteAllocation,
  fetchAllocations,
} from "../controllers/savingAllocation.Controller.js";

const router = Router();

//Route 1
router.post("/allocate", verifyJWT, allocateAmount);

//Route 2
router.delete("/delete/:aId", verifyJWT, deleteAllocation);

//Route 3
router.get("/fetch", verifyJWT, fetchAllocations);

export default router;
