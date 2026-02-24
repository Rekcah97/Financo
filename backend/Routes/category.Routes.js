import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createCategory,
  deleteCategory,
} from "../controllers/category.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createCategory);

//Route 1
router.delete("/delete/:catId", verifyJWT, deleteCategory);

export default router;
