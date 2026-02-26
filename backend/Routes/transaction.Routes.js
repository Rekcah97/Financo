import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createTransaction,
  deleteTransaction,
} from "../controllers/transaction.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createTransaction);

//Route 2
router.delete("/delete/:transactionId", verifyJWT, deleteTransaction);

export default router;
