import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUserDetails } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middlware.js";

const router = Router()

router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser)
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/update-user-details').patch(verifyJWT, updateUserDetails);

export default router;