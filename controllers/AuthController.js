const UserModel = require('../models/User');
const { generateJWT } = require('../services/tokenService');
const { validateEmail, validatePassword } = require('../utils/validators');
const crypto = require('crypto');
const sendEmail=require('../utils/sendEmail');


class AuthController {
    static async register(req, res) {
        try {
            const { email, password, role_id, user_name, first_name, last_name, phone_number, address } = req.body;
            const allowedRoleIds = await UserModel.getRoleIds();
            // Check if the role_id is valid
            if (!allowedRoleIds.includes(role_id)) {
                return res.status(403).json({ message: 'Invalid role ID' });
            }

            if (role_id === 1) return res.status(403).json({ message: 'Admin registration is not allowed' });

            // Check if the email already exists
            const existingUser = await UserModel.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'This email is already registered, try with another email' });
            }

            // Validate email and password
            if (!validateEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address.' });
            if (!validatePassword(password)) return res.status(400).json({ message: 'Password must meet security requirements.' });


            const userId = await UserModel.createUser({ email, password, role_id, user_name, first_name, last_name, phone_number, address });
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) return res.status(400).json({ message: 'Please provide email and password!' });

            const user = await UserModel.findUserByEmail(email);
            if (!user || !(await UserModel.comparePasswords(password, user.password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = generateJWT(user); // token service to generate the JWT

            // Set the token in a cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000  //1 hour
            });

            res.status(200).json({ message: 'Login successful'});
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    static logout(req, res) {
        res.clearCookie('jwt'); // Clear the token cookie
        res.status(200).json({ message: 'Logged out successfully' });
    }

    static async forgotPassword(req, res) {
    
        const { email } = req.body;

        try {
            const user = await UserModel.findUserByEmail(email);
            if (!user) {
                console.log("User not found with email:", email);
                return res.status(404).json({ message: 'No user found with that email address.' });
            }
            console.log("User found:", user);

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');

            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            
              // Calculate the expiration time (10 minutes from now)
              const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
             
            // Update the user's reset token in the database
             await UserModel.updateUserResetToken(user.user_id, hashedToken, expires);

            // Construct reset URL
            const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
            const message = `Forgot your password? Reset it using this link: ${resetURL}\nIf you didn't request a password reset, please ignore this email.`;
           

            // send the email
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 minutes)',
                message
            });
          
            res.status(200).json({ message: 'Token sent to email!' });

        } catch (err) {
            

            // Clear the reset token if sending email fails
            if (user) {
                await UserModel.updateUserResetToken(user.user_id, null, null);
            }
            res.status(500).json({ message: 'Error sending the email. Try again later.' });
        }
    }

    static async resetPassword(req, res) {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await UserModel.findUserByResetToken(hashedToken);

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        const newPassword = req.body.password;
          // Validate the new password
          if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
            });
        }
        await UserModel.updateUserPassword(user.user_id, newPassword);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    }

    static async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const user = await UserModel.findUserById(req.userId);
    
        if (!(await UserModel.comparePasswords(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }
        
       // Validate the new password
       if (!validatePassword(newPassword)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
        });
        }     
        await UserModel.updateUserPassword(user.user_id, newPassword);
        res.status(200).json({
            message: 'Password changed successfully. Please log in again.',
            loginUrl: 'http://localhost:3000/api/auth/login' 
        });
    }

}

module.exports = AuthController;
