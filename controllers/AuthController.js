// controllers/authController.js
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../utils/validators');
require('dotenv').config(); // Load environment variables

class AuthController {
    static async register(req, res) {
        try {
            const { 
                email, 
                password, 
                role_id, 
                user_name, 
                first_name, 
                last_name, 
                phone_number, 
                address 
            } = req.body;

            // Check if the email already exists
            const existingUser = await UserModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Validate password strength
            if (!validatePassword(password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters.' });
            }

            // Prevent registration for admin users
            if (role_id && role_id === 1) { // Assuming role_id of 1 corresponds to admin
                return res.status(403).json({ message: 'Admin registration is not allowed' });
            }

            const userId = await UserModel.createUser({
                email,
                password,
                role_id,
                user_name,
                first_name,
                last_name,
                phone_number,
                address
            });
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    static async login(req, res) {
        try {
         const { email, password } = req.body;

        // Check if email and password are provided
         if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password!' });
         }
            const user = await UserModel.findUserByEmail(req.body.email);
            if (!user || !(await UserModel.comparePasswords(req.body.password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = AuthController.generateJWT(user); // Generate JWT here

            // Set the token in a cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set secure flag in production
                maxAge: 3600000, // 1 hour
            });

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    static generateJWT(user) {
        return jwt.sign(
            { id: user.user_id, email: user.email, role: user.role_id },
            process.env.JWT_SECRET, // Use the JWT secret from the environment variable
            { expiresIn: '1h' }
        );
    }

    // Add other methods for logout and token verification
    static logout(req, res) {
        res.clearCookie('token'); // Clear the cookie
        res.status(200).json({ message: 'Logged out successfully' });
    }

    static verifyToken(req, res, next) {
        const token = req.cookies.token; // Get the token from cookies
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.userId = decoded.id; // Attach user ID to request object
            next(); // Proceed to the next middleware
        });
    }
}

module.exports = AuthController;
