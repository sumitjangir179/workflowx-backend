import ProjectSchema from '../models/project.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createProjectSchema } from '../validations/project.validation.js';

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

  const project = await ProjectSchema.create({ name, userId: req?.user?.id, });

  if (!project) {
    throw new ApiError(500, 'Internal server error while creating project');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, 'Project created successfully'));
});

export { createProject };
