// Importing required modules

// Library for cryptographic operations 
import crypto from 'crypto'; 
// Library for password hashing
import bcrypt from 'bcryptjs'; 
// Library for email validation
import emailValidator from 'email-validator';
// Utility function for sending emails 
import sendEmail from '../utils/sendEmail.util.js';
// Importing the User model for this controller
import User from '../models/user.model.js';
// Utility functions for handling errors, responses, and asynchronous operations
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

/*
    Controller function to register a new user.
    Handles the HTTP POST request to register a user.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    if(!name || !email || !password || !confirmPassword) {
        throw new ApiError(400, 'All field must be filled.');
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new ApiError(400, 'Email-ID is already exist, Please login.');
    }

    const validateEmail = emailValidator.validate(email);
    if(!validateEmail) {
        throw new ApiError(400, 'Email-ID must be in valid format.');
    }

    if(password !== confirmPassword) {
        throw new ApiError(401, 'Password & Confirm Password should be matched.');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const newUser = await User.findById(user._id).select('-password');
    if(!newUser) {
        throw new ApiError(404, 'Something went wrong while registering the user.');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newUser, 'Registration completed succesfully.'));
});

/*
    Controller function to log in a user.
    Handles the HTTP POST request to log in a user.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password) {
        throw new ApiError(400, 'All fields must be filled.');
    }

    const user = await User.findOne({ email }).select('+password');
    if(!user) {
        throw new ApiError(404, 'Invalid Email-ID or Password.');
    }

    const isPassword = await user.isPasswordCorrect(password);
    if(!isPassword) {
        throw new ApiError(401, 'Invalid Email-ID or Password.');
    }

    const token = user.generateJWTToken();
    const cookieOptions = {
        maxAge: 12 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true 
    }

    const loggedUser = await User.findById(user._id).select('-password');
    if(!loggedUser) {
        throw new ApiError(404, 'Something went wrong while login the user.');
    }

    return res 
        .status(200)
        .cookie('token', token, cookieOptions)
        .json(new ApiResponse(200, loggedUser, 'Login completed successfully.'));
});

/*
    Controller function to log out a user.
    Handles the HTTP GET request to log out a user.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const logoutUser = asyncHandler(async (req, res) => {

    const { id } = req.user;

    const user = await User.findById(id).select('-password');
    if(!user) {
        throw new ApiError(404, 'User is not logged in, Please login or does not exist.');
    }

    const cookieOptions = {
        maxAge: 0,
        secure: true,
        httpOnly: true 
    }

    return res 
        .status(200)
        .cookie('token', null, cookieOptions)
        .json(new ApiResponse(200, {}, 'Logout completed successfully.'));
});

/*
    Controller function to change user password.
    Handles the HTTP POST request to change the password.

    @param {Object} req - Express request object.
    @param {Object} res - Express response object.
    @returns {Object} JSON response indicating success or failure.
*/
const changePassword = asyncHandler(async (req, res) => {

    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword) {
        throw new ApiError(400, 'All fields must be filled.');
    }

    const user = await User.findById(id).select('+password');
    if(!user) {
        throw new ApiError(404, 'User is not logged in, Please login or does not exist.');
    }

    const isPassword = await user.isPasswordCorrect(oldPassword);
    if(!isPassword) {
        throw new ApiError(401, 'Please enter your right password.');
    }

    if(oldPassword === newPassword) {
        throw new ApiError(400, 'old password and new password should not match.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { 
            $set: { password: hashedPassword }
        },
        { new: true }
        ).select('-password');
    if(!user) {
        throw new ApiError(404, 'Something went wrong, Please try again.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Password changed successfully.'));
});

/*
    Controller function to handle password forgot request.
    Sends an email with a password reset link to the user.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if(!email) {
        throw new ApiError(400, 'Email-ID field must be filled.');
    }

    const user = await User.findOne({ email }).select('-password');
    if(!user) {
        throw new ApiError(401, 'Email-ID does not exist, Please register.');
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const passwordResetLink = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

    const subject = 'Password reset request';
    const message = `You have requested to reset your password. Please click the following link to reset your password: <a href="${passwordResetLink}" target="_blank">Reset Password</a>. If the link is not clickable, please copy and paste it into your browser.`

    await sendEmail(email, subject, message);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, `A password reset link has been sent successfully to ${email}. Please check your email inbox.`));

});

/*
    Controller function to handle password reset.
    Resets the user's password based on the reset token.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const resetPassword = asyncHandler(async (req, res) => {

    const { resetToken } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if(!newPassword || !confirmNewPassword) {
        throw new ApiError(400, 'All fields must be filled.');
    }

    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User
        .findOne({
            forgotPasswordToken: hashedResetToken,
            forgotPasswordExpiryDate: { $gt: Date.now() }
        })
        .select('-password');
    if (!user) {
        throw new ApiError(401, "Invalid or expired token, Please try again.");
    }

    if(newPassword !== confirmNewPassword) {
        throw new ApiError(401, 'Password & Confirm Password should be matched.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { 
            $set: { 
                password: hashedPassword, 
                forgotPasswordToken: null, 
                forgotPasswordExpiryDate: null 
            } 
        },
        { new: true } 
        ).select('-password');
    if(!updatedUser) {
        throw new ApiError(404, 'Something went wrong, Please try again.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Password reset successfully.'));
});

/*
    Controller function to retrieve user details.
    Handles the HTTP GET request to retrieve user details. 

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const userDetails = asyncHandler(async (req, res) => {

    const { id } = req.user;

    const user = await User.findById(id).select('-password');
    if(!user) {
        throw new ApiError(404, 'User is not logged in, Please login or does not exist.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, `Welcome ${user.name}.`));
});

// Exporting functions related to user authentication and management
export { registerUser, loginUser, logoutUser, changePassword, forgotPassword, resetPassword, userDetails };

