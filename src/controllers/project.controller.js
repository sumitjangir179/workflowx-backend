import ProjectSchema from '../models/project.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createProjectSchema,
  getProjectDetailSchema,
  updateProjectSchema,
} from '../validations/project.validation.js';

const createProject = asyncHandler(async (req, res) => {
  const validationResult = await createProjectSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      JSON.stringify(
        validationResult.error?.issues.map((issue) => issue.message).join(', '),
      ),
    );
  }

  const { name } = validationResult.data;

  const existingProject = await ProjectSchema.findOne({ where: { name } });

  if (existingProject) {
    throw new ApiError(409, 'Project with this name already exists');
  }

  const project = await ProjectSchema.create({ name, userId: req?.user?.id });

  if (!project) {
    throw new ApiError(500, 'Internal server error while creating project');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, 'Project created successfully'));
});

const getAllProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.body;

  const offset = (page - 1) * limit;

  const { count, rows: projects } = await ProjectSchema.findAndCountAll({
    limit,
    offset,
    where: { userId: req?.user?.id },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { projects, count },
        'Projects fetched successfully',
      ),
    );
});

const getProjectDetail = asyncHandler(async (req, res) => {
  const validationResult = await getProjectDetailSchema.safeParseAsync(
    req.params,
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      validationResult.error?.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { projectId } = validationResult.data;

  const project = await ProjectSchema.findOne({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Project fetched successfully'));
});

const updateProjectDetail = asyncHandler(async (req, res) => {
  const validationProjectResult = await getProjectDetailSchema.safeParseAsync(
    req.params,
  );

  if (validationProjectResult.error) {
    throw new ApiError(
      400,
      validationProjectResult.error?.issues
        .map((issue) => issue.message)
        .join(', '),
    );
  }

  const validationResult = await updateProjectSchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      validationResult.error?.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { projectId } = validationProjectResult.data;
  const { name, description } = validationResult.data;

  const [affectedRows, [updatedProject]] = await ProjectSchema.update(
    { name, description },
    { where: { id: projectId }, returning: true },
  );

  if (!affectedRows) {
    throw new ApiError(404, 'Project not found or no changes made');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, 'Project updated successfully'));
});

const deleteProject = asyncHandler(async (req, res) => {
  const validationResult = await getProjectDetailSchema.safeParseAsync(
    req.params,
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      validationResult.error?.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { projectId } = validationResult.data;

  const count = await ProjectSchema.destroy({
    where: { id: projectId },
  });


  if (!count) {
    throw new ApiError(404, 'Project not found or no changes made');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Project deleted successfully'));
});

export {
  createProject,
  getAllProjects,
  getProjectDetail,
  updateProjectDetail,
  deleteProject,
};
