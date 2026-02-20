import { Router } from "express";
import { body } from "express-validator";
import { createUser } from "../controllers/auth.controller.js";

const router = Router();

//Router 1
router.post(
  "/signup",
  [
    body("name", "enter a valid Name").escape().trim().isLength({ min: 3 }),
    body("email", "enter a valid Email").normalizeEmail().isEmail(),
    body("password", "enter a strong Password").isStrongPassword(),
  ],
  createUser,
);

export default router;
