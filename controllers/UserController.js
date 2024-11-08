const UserModel = require('../models/User');
const ItemModel = require('../models/Item');

class UserController {
    // Retrieve all users
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving users', error });
        }
    }

    // Retrieve user by ID
    
   static async getUserById(userId) {
      try {
        const user = await UserModel.findUserById(userId);
        return user || null;  // Return the user or null if not found
       } catch (error) {
        console.error('Error retrieving user by ID:', error);
        return null; // Return null on error to allow error handling in caller function
       }
   }

   static async getUser(req,res) {
    const { id } = req.params; 
    try {
       //retrieve the user by ID
       const user = await UserModel.findUserById(Number(id));
       if (!user) {
           // If no user is found
           return res.status(404).json({ error: 'User not found' });
       }  
       // If user is found, respond with user data
       return res.status(200).json(user);
       } catch (error) {
       // Log the error and respond with a 500 status for server errors
       console.error('Error retrieving user by ID:', error);
       return res.status(500).json({ error: 'Failed to retrieve user' });
       }
   }
    // Retrieve user by email
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

    // Retrieve user by phone number
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

    // Create a new user 
    static async createUser(req, res) {
        try {
            const newUser = req.body;
            // Check if the email already exists
            const existingUser = await UserModel.findUserByEmail(newUser.email);
            if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered, please use another email.' });
        }
            const userId = await UserModel.createUser(newUser);
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    // Delete a user by ID 
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
           // Set user_id to NULL for all items related to this user
            await ItemModel.nullifyUserIdInItems(id);        
            
            await UserModel.deleteUser(id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }

    // Retrieve the current authenticated user’s information
    static async getCurrentUser(req, res) {
        try {
            const userId = req.userId;  // set by the verifyToken middleware
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
            const userId = req.userId;  // set by the verifyToken middleware
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
