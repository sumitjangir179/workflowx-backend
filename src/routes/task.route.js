import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlware.js";
import { createTask, deleteTask, getAllTask, getTaskDetail, updateTaskDetail } from "../controllers/task.controller.js";

const router = Router()

router.route('/create-task').post(verifyJWT, createTask);
router.route('/get-all-project-task').get(verifyJWT, getAllTask);
router.route('/task-detail/:taskId').get(verifyJWT, getTaskDetail);
router.route('/update-task-detail/:taskId').patch(verifyJWT, updateTaskDetail);
router.route('/delete-task/:taskId').delete(verifyJWT, deleteTask);

export default router;