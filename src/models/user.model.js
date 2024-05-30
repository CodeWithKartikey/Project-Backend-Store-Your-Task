// Import necessary modules

// Library for password hashing
import bcrypt from 'bcryptjs'; 
// Library for generating JSON Web Tokens (JWT)
import JWT from 'jsonwebtoken';
// Library for cryptographic operations 
import crypto from 'crypto'; 
// Schema and model objects from Mongoose for MongoDB interactions
import { Schema, model } from "mongoose";

/*
    User Schema definition
*/
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            minLength: [3, 'Name must be at least 3 characters long.'],
            maxLength: [50, 'Name should be less than 50 characters long.'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minLength: [8, 'Password must be at least 8 characters long.'],
            maxLength: [256, 'Password should be less than 256 characters long.'],
            select: false
        },
        userVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry: {
            type: Date
        }
    }, {timestamps: true}
);

/*
    Middleware to hash password before saving to the database,
    It hashes the password using bcrypt if it has been modified
*/
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

/*
    Method to compare / check the provided password
    @param {string} password - The password to compare / check
    @returns {boolean} - True if the password is correct, false otherwise
*/
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

/*
    Method to generate JWT token for user authentication
    @returns {string} - JWT token
*/
userSchema.methods.generateJWTToken = function() {
    return JWT.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
};

/*
    Method to generate email verification token
    @returns {string} - Email verification token
*/
userSchema.methods.generateEmailVerificationToken = function() {
    const emailToken = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(emailToken).digest('hex');
    this.emailVerificationExpiry = Date.now() + (15 * 60 * 1000);
    return emailToken;
};

/*
    Method to generate password reset token
    @returns {string} - Password reset token
*/
userSchema.methods.generatePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.forgotPasswordExpiry = Date.now() + (15 * 60 * 1000);
    return resetToken;
};

/*
    User Model definition
*/
const user = model('User', userSchema);

// Exporting the userProfile object as the default export.
export default user;