import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from '../utils/ApiResponse.js'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log('accrsstoken', accessToken)
        console.log("refresh", refreshToken)

        user.refreshToken = refreshToken;
        await user.save()

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Internal server error while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, password } = req.body

    if ([firstName, lastName, email, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ where: { email } });

    if (existedUser) {
        throw new ApiError(409, "User with this credentials already exists")
    }

    const user = await User.create({ firstName, lastName, email, password })

    const createdUser = await User.findByPk(user?.id)

    if (!createdUser) {
        throw new ApiError(500, "Internal server error while register user")
    }

    return res.status(200).json(new ApiResponse(201, createdUser, 'User register successfully'))


})


const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if ([email, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new ApiError(404, "User with this credentials does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    const loggedInUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });

    const options = { httpOnly: true, secure: true };

    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'User login successfully'))

})

export { registerUser, loginUser }