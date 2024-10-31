const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { promisify } = require('util');
const sendEmail = require('../utils/sendEmail'); // Assume a function to send emails

const roleMapping = {
    admin: 1,
    vendor: 2,
    customer: 3
};

const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt; // Get the token from cookies
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided, please log in to get access' });
    }
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if the user exists in the database
        const currentUser = await UserModel.findUserById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists' });
        }

        // Attach user data to the request
        req.userId = currentUser.user_id;
        req.userRole = currentUser.role_id;
        req.user = currentUser;

    
        next(); // Pass to the next middleware

    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
        } else if (err.name === 'JsonWebTokenError') {
            // This error occurs if the token is malformed or has an invalid signature
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        } else {
            // Handle any other errors
            return res.status(401).json({ message: 'Unauthorized, token verification failed' });
        }
    }

}

// accept role names or IDs
const authorizeRole = (...allowedRoles) => (req, res, next) => {
    const allowedRoleIds = allowedRoles.map(role => typeof role === 'string' ? roleMapping[role] : role);

    if (!allowedRoleIds.includes(req.userRole)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
};

module.exports = {
    verifyToken,
    authorizeRole
};
