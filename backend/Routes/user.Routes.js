import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { fetchUser } from "../controllers/user.Controller.js";

const router = Router();

//Route 1
router.get("/fetchuser", verifyJWT, fetchUser);

export default router;
