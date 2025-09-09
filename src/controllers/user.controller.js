import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  loginUserSchema,
  registerUserSchema,
  updateUserDetailsSchema,
} from '../validations/user.validation.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Internal server error while generating tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const validateResult = await registerUserSchema.safeParseAsync(req.body);

  if (validateResult.error) {
    throw new ApiError(
      400,
      validateResult.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { email } = validateResult.data;

  const [user, createdUser] = await User.findOrCreate({
    where: { email },
    defaults: { email },
  });

  if (!createdUser) {
    throw new ApiError(409, 'User with this credentials already exists');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id,
  );

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ['password', 'refreshToken'] },
  });

  const options = { httpOnly: true, secure: true };

  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInUser, accessToken, refreshToken },
        'User register successfully',
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const validateResult = await loginUserSchema.safeParseAsync(req.body);

  if (validateResult.error) {
    throw new ApiError(
      400,
      validateResult.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { email, password } = validateResult.data;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'User with this credentials does not exist');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id,
  );

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ['password', 'refreshToken'] },
  });

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User login successfully',
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.refreshToken = null;
  await user.save();
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const validateResult = await updateUserDetailsSchema.safeParseAsync(req.body);

  if (validateResult.error) {
    throw new ApiError(
      400,
      validateResult.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { name, password } = validateResult.data;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (password) user.password = password;

  await user.save();

  user.password = undefined;
  user.refreshToken = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User details updated successfully'));
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateUserDetails,
};
