import TaskSchema from '../models/task.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { updateTaskSchema } from '../validations/task.validation.js';

const createTask = asyncHandler(async (req, res) => {
  const validationResult = await createTaskSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      JSON.stringify(
        validationResult.error?.issues.map((issue) => issue.message).join(', '),
      ),
    );
  }

  const { name, projectId } = validationResult.data;

  const [task, taskCreated] = await TaskSchema.findOrCreate({
    where: { name, projectId, userId: req?.user?.id },
  });

  if (!taskCreated) {
    throw new ApiError(500, 'Internal server error while creating task');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, task, 'Project created successfully'));
});

const getAllTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 10 } = req.body;

  const offset = (page - 1) * limit;

  const { count, rows: tasks } = await TaskSchema.findAndCountAll({
    limit,
    offset,
    where: { projectId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks, count }, 'Tasks fetched successfully'));
});

const getTaskDetail = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await TaskSchema.findOne({ where: { id: taskId } });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Project fetched successfully'));
});

const updateTaskDetail = asyncHandler(async (req, res) => {
  const validationResult = await updateTaskSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      validationResult.error?.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { taskId, name, description } = validationResult.data;

  const [affectedRows, [updatedTask]] = await TaskSchema.update(
    { name, description },
    { where: { id: taskId }, returning: true },
  );

  if (!affectedRows) {
    throw new ApiError(404, 'Task not found or no changes made');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, 'Project updated successfully'));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const count = await TaskSchema.destroy({
    where: { id: taskId },
  });

  if (!count) {
    throw new ApiError(404, 'Task not found or no changes made');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Project deleted successfully'));
});

export {
  createTask,
  getAllTask,
  getTaskDetail,
  updateTaskDetail,
  deleteTask,
};
