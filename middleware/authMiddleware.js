const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { promisify } = require('util');
const sendEmail = require('../utils/sendEmail'); // Assume a function to send emails

const roleMapping = {
    admin: 1,
    vendor: 2,
    customer: 3,
    Insurance_Team:4
};

const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt; // Get the token from cookies
   
    //If the token isn't send by cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
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

        // Check if the user changed their password after the token was issued
        const passwordChanged = await UserModel.hasPasswordChangedSince(decoded.id, decoded.iat);
        if (passwordChanged) {
            return res.status(401).json({ message: 'Password was changed recently. Please log in again.' });
        }

        // Attach user data to the request
        req.userId = currentUser.user_id;
        req.userRole = currentUser.role_id;
        req.user = currentUser;
        console.log('Decoded user role from token:', req.userRole);
    
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
    console.log('Allowed roles:', allowedRoleIds);
    console.log('User role:', req.userRole);
    
    if (!allowedRoleIds.includes(req.userRole)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    else{
        next();
    }
    
};

module.exports = {
    verifyToken,
    authorizeRole
};
