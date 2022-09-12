const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { restart } = require('nodemon');

const protect = asyncHandler(async (req, res, next) => {

    let token;

    // If there's an authorization header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password'); // Exclude the password.

            next();

        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }

    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized. No token.');
    }

});

module.exports = { protect };