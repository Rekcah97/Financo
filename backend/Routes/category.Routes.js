import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createCategory } from "../controllers/category.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createCategory);

export default router;
