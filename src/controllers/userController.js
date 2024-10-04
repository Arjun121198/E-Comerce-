const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendMail = require('../utilis/mailHelper');

class UserController {

    signUp = async (req, res) => {
        try {
          const { email, password, ...userData } = req.body;
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const user = await User.create({
            ...userData,
            email,  
            password: hashedPassword, 
          });

          sendMail(
            email,
            'Welcome to Our Platform!', 
            `Hi ${userData.name}, Thank you for signing up!<br>`, 
            `<b>Hi ${userData.name},</b><br><br>Thank you for signing up to our platform!<br><br>Best regards,<br>E-Commerce Team`
          );
      
          res.status(200).json({ message: 'User registered successfully', user });
        } catch (error) {
          res.status(500).json({ error: 'An error occurred during registration.', details: error });
        }
    };
    
    getUserById = async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          res.status(200).json({ message: 'Get User detail successfully', user });
        } catch (error) {
          res.status(500).json({ error: 'An error occurred during get user.', details: error });
        }
    };

    updateUser = async (req, res) => {
        try {
          const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
          res.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
          handleError(res, error);
        }
    };

    deleteUser = async (req, res) => {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (handleNotFound(res, user, 'User not found')) return;
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        handleError(res, error);
      }
    };
}

module.exports = new UserController();