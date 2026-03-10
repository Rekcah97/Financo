import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { summaryDetails } from "../controllers/summary.Controller.js";

const router = Router();

//Route 1
router.get("/fetch", verifyJWT, summaryDetails);

export default router;
