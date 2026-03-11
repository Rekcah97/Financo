import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  balanceDetails,
  summaryDetails,
  summaryDetailsbyDate,
} from "../controllers/summary.Controller.js";

const router = Router();

//Route 1
router.get("/fetch", verifyJWT, summaryDetails);

//Route 2
router.get("/fetchByDate", verifyJWT, summaryDetailsbyDate);

//Route 3
router.get("/fetchBalance", verifyJWT, balanceDetails);

export default router;
