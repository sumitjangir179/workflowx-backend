import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlware.js";
import { createProject, deleteProject, getAllProjects, getProjectDetail, updateProjectDetail } from "../controllers/project.controller.js";

const router = Router()

router.route('/create-project').post(verifyJWT, createProject);
router.route('/get-all-project').get(verifyJWT, getAllProjects);
router.route('/project-detail/:projectId').get(verifyJWT, getProjectDetail);
router.route('/update-project-detail/:projectId').patch(verifyJWT, updateProjectDetail);
router.route('/delete-project/:projectId').delete(verifyJWT, deleteProject);

export default router;