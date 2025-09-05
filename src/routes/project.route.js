import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlware.js";
import { createProject, getAllProjects, getProjectDetail } from "../controllers/project.controller.js";

const router = Router()

router.route('/create-project').post(verifyJWT, createProject);
router.route('/get-all-project').get(verifyJWT, getAllProjects);
router.route('/project-detail/:projectId').get(verifyJWT, getProjectDetail);

export default router;