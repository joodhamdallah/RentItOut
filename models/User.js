// models/userModel.js
const connection = require('../config/database'); // Import your database connection
const bcrypt = require('bcrypt');

class UserModel {
    static async findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE email = ?';
            connection.query(query, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); // Return the first user found
            });
        });
    }

    static async createUser(data) {
        const { email, password, role_id, user_name, first_name, last_name, phone_number, address } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO Users (user_name, email, password, role_id, phone_number, first_name, last_name, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            connection.query(query, [user_name, email, hashedPassword, role_id, phone_number, first_name, last_name, address], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.insertId); // Return the ID of the newly created user
            });
        });
    }

    static async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Add other methods for user operations if needed
}

module.exports = UserModel;
