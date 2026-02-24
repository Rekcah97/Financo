import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createTransaction } from "../controllers/transaction.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createTransaction);

export default router;
