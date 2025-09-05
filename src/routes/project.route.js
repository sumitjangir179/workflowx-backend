import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlware.js";
import { createProject } from "../controllers/project.controller.js";

const router = Router()

router.route('/create-project').post(verifyJWT, createProject);

export default router;