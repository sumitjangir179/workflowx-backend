import { Router } from "express";
import { getCurrentUser, loginUser, registerUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middlware.js";

const router = Router()

router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser)
// protected route
router.route('/current-user').get(verifyJWT, getCurrentUser);

export default router;