const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendMail = require('../utils/mailHelper');
const { successResponse, errorResponse } = require('../utils/responseHelper'); // Import helper functions

class UserController {

    // Sign Up a New User
    signUp = async (req, res) => {
        try {
            const { email, password, ...userData } = req.body;
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return errorResponse(res, 400, 'Email already exists!');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                ...userData,
                email,  
                password: hashedPassword, 
            });

            // Send welcome email
            sendMail(
                email,
                'Welcome to Our Platform!', 
                `Hi ${userData.name}, Thank you for signing up!<br>`, 
                `<b>Hi ${userData.name},</b><br><br>Thank you for signing up to our platform!<br><br>Best regards,<br>E-Commerce Team`
            );

            return successResponse(res, 200, 'User registered successfully', user);
        } catch (error) {
            return errorResponse(res, 500, 'An error occurred during registration.', error.message);
        }
    };
    
    // Get User by ID
    getUserById = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return errorResponse(res, 404, 'User not found');
            }

            return successResponse(res, 200, 'Get User detail successfully', user);
        } catch (error) {
            return errorResponse(res, 500, 'An error occurred during get user.', error.message);
        }
    };

    // Update User
    updateUser = async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!user) {
                return errorResponse(res, 404, 'User not found');
            }

            return successResponse(res, 200, 'User updated successfully', user);
        } catch (error) {
            return errorResponse(res, 500, 'An error occurred during user update.', error.message);
        }
    };

    // Delete User
    deleteUser = async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return errorResponse(res, 404, 'User not found');
            }

            return successResponse(res, 200, 'User deleted successfully');
        } catch (error) {
            return errorResponse(res, 500, 'An error occurred during user deletion.', error.message);
        }
    };
}

module.exports = new UserController();
