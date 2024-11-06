// models/userModel.js
const connection = require('../config/database'); 
const bcrypt = require('bcrypt');

class UserModel {
    static async getRoleIds() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT role_id FROM Roles'; // role IDs are stored in a table called 'Roles'
        connection.query(query, (err, results) => {
            if (err) return reject(err);
            const roleIds = results.map(row => row.role_id); // Extract role_id from each row
            resolve(roleIds); // Return an array of role IDs
        });
    });
   }
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

    static async findUserById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE user_id = ?';
            connection.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); //Return the user found by ID
            });
        });
    }
        // Update user with reset token and expiration
        static async updateUserResetToken(userId, resetToken, expires) {
            return new Promise((resolve, reject) => {
                const query = 'UPDATE Users SET password_reset_token = ?, password_reset_expires = ? WHERE user_id = ?';
                connection.query(query, [resetToken, expires, userId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        }
    
        // Find user by reset token and check expiration
        static async findUserByResetToken(token) {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM Users WHERE password_reset_token = ? AND password_reset_expires > ?';
                connection.query(query, [token, Date.now()], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]); // Return the user found by reset token
                });
            });
        }
    
        // Update user password and clear reset fields
        static async updateUserPassword(userId, newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const currentTimestamp = new Date(); // Get current date and time
            return new Promise((resolve, reject) => {
                const query = 'UPDATE Users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL, password_changed_at = ? WHERE user_id = ?';
                connection.query(query, [hashedPassword, currentTimestamp, userId], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        }

        static async updateUserProfile(userId, fieldsToUpdate) {
            return new Promise((resolve, reject) => {
                // Build query dynamically based on fieldsToUpdate
                const fields = Object.keys(fieldsToUpdate);
                const values = Object.values(fieldsToUpdate);
        
                const setClause = fields.map(field => `${field} = ?`).join(', ');
                const query = `UPDATE Users SET ${setClause} WHERE user_id = ?`;
        
                // Add userId to the values array
                values.push(userId);
        
                connection.query(query, values, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        }
        
        static async findAllUsers() {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM Users';
                connection.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results); // Return all users
                });
            });
        }
    
        static async deleteUser(id) {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM Users WHERE user_id = ?';
                connection.query(query, [id], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
     
       }    
       static async findUserByPhoneNumber(phoneNumber) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE phone_number = ?';
            connection.query(query, [phoneNumber], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Return the first user found
            });
        });
    }
    static async hasPasswordChangedSince(userId, iat) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT password_changed_at FROM Users WHERE user_id = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return resolve(false); // No user found, assume password has not changed
                }

                const passwordChangedAt = results[0].password_changed_at;
                if (passwordChangedAt) {
                    const passwordChangedAtDate = new Date(passwordChangedAt);
                    return resolve(passwordChangedAtDate.getTime() > iat * 1000); // Compare timestamps
                }
                
                return resolve(false); // No change recorded
            });
        });
    }

    static async getUserById(userId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Users WHERE user_id = ?', [userId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.length === 0) {
                    return resolve(null); // Or reject with a specific error if preferred
                }
                resolve(results[0]);
            });
        });
    }
}


module.exports = UserModel;
