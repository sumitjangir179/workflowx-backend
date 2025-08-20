import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser)

export default router;