import { Router } from "express";
import { body } from "express-validator";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.Controller.js";

const router = Router();

//Route 1
router.post(
  "/signup",
  [
    body("name", "enter a valid Name").escape().trim().isLength({ min: 3 }),
    body("email", "enter a valid Email").normalizeEmail().isEmail(),
    body("password", "enter a strong Password").isStrongPassword(),
  ],
  createUser,
);

//Route 2
router.post(
  "/signin",
  [body("email", "enter a valid Email").normalizeEmail().isEmail()],
  loginUser,
);

//Route 3
router.post("/refresh", refreshAccessToken);

//Route 4
router.post("/logout", logoutUser);

export default router;
