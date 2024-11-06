const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateJWT = (user) => {
    const jti = crypto.randomBytes(16).toString('hex');
    return jwt.sign(
        { id: user.user_id, email: user.email, role: user.role_id, jti },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

module.exports = { generateJWT };
