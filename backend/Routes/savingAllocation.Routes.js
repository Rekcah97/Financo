import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { allocateAmount } from "../controllers/savingAllocation.Controller.js";

const router = Router();

//Route 1
router.post("/allocate", verifyJWT, allocateAmount);

export default router;
