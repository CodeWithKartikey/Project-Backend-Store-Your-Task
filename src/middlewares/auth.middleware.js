// Importing required modules

// Library for generating JSON Web Tokens (JWT)
import JWT from 'jsonwebtoken';
// Importing the User model for this auth section
import User from '../models/user.model.js';
// Utility functions for handling errors, responses, and asynchronous operations
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

// Middleware to check if the user is logged in
const isLoggedIn = asyncHandler(async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return res
            .status(401)
            .json(new ApiResponse(401, {}, 'Unauthorized access! Please login first.'));
    }

    const verifiedToken = JWT.verify(token, process.env.JWT_SECRET);
    if(!verifiedToken) {
        throw new ApiError(401, 'Invalid token! Please login first.');
    }

    const verifiedUser = await User.findById(verifiedToken?.id).select('-password');
    if(!verifiedUser) {
        throw new ApiError(404, 'Something went wrong, Please try again.');
    }

    req.user = verifiedUser;
    next();
});

// Export default isLoggedIn middleware function
export default isLoggedIn;