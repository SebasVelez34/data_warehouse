import dotenv from 'dotenv';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config();

function createToken(data) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
    }, process.env.PRIVATE_KEY);
    
}

function validatePassword(password, loginPassword) {
    if(!password || !loginPassword) return false;
    return bcrypt.compareSync(loginPassword, password);
}
const JWT_SECRET = process.env.JWT_SECRET || "asupersecretkey";

export {
    JWT_SECRET,
    createToken,
    validatePassword
}