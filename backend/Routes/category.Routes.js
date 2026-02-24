import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchAllCategory,
} from "../controllers/category.Controller.js";

const router = Router();

//Route 1
router.post("/create", verifyJWT, createCategory);

//Route 2
router.delete("/delete/:catId", verifyJWT, deleteCategory);

//Route 3
router.patch("/edit/:catId", verifyJWT, editCategory);

//Route 4
router.get("/fetchAll", verifyJWT, fetchAllCategory);

export default router;
