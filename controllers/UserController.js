const UserModel = require('../models/User');

class UserController {
    // Retrieve all users (admin only)
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving users', error });
        }
    }

    // Retrieve user by ID (admin only)
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user by ID', error });
        }
    }

    // Retrieve user by email (admin only)
    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserModel.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user by email', error });
        }
    }

    // Retrieve user by phone number (admin only)
    static async getUserByPhoneNumber(req, res) {
        try {
            const { phoneNumber } = req.params;
            const user = await UserModel.findUserByPhoneNumber(phoneNumber);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user by phone number', error });
        }
    }

    // Create a new user (admin only)
    static async createUser(req, res) {
        try {
            const newUser = req.body;
            const userId = await UserModel.createUser(newUser);
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    // Delete a user by ID (admin only)
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await UserModel.deleteUser(id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }

    // Retrieve the current authenticated user’s information
    static async getCurrentUser(req, res) {
        try {
            const userId = req.userId;  // This is set by the verifyToken middleware
            const user = await UserModel.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user', error });
        }
    }

    // Update the current authenticated user's profile
    static async updateUser(req, res) {
        try {
            const userId = req.userId;  // This is set by the verifyToken middleware
            const { phone_number, address, first_name, last_name } = req.body;

            // Create an object with only the provided fields to update
            const fieldsToUpdate = {};
            if (phone_number) fieldsToUpdate.phone_number = phone_number;
            if (address) fieldsToUpdate.address = address;
            if (first_name) fieldsToUpdate.first_name = first_name;
            if (last_name) fieldsToUpdate.last_name = last_name;

            // Ensure there are fields to update
            if (Object.keys(fieldsToUpdate).length === 0) {
                return res.status(400).json({ message: 'No fields provided to update.' });
            }

            // Update the user's profile in the database
            await UserModel.updateUserProfile(userId, fieldsToUpdate);
            res.status(200).json({ message: 'Profile updated successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error });
        }
    }
}

module.exports = UserController;
