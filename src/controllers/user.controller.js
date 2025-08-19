import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, password } = req.body

    if ([firstName, lastName, email, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({where: { email }});

    if (existedUser) {
        throw new ApiError(409, "User with this credentials already exists")
    }

    const user = await User.create({ firstName, lastName, email, password })

    const createdUser = await User.findByPk(user?.id)

    if (!createdUser) {
        throw new ApiError(500, "Internal server error while register user")
    }

    res.status(200).json(new ApiResponse(201, createdUser, 'User register successfully'))


})

export { registerUser }