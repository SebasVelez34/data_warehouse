'use strict'

const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuth(req, res, next) {
    if(!req.headers.authorization || req.headers.authorization == "Bearer"){
        return res.status(403).send({ message: "You don't have authorization" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoded.data;
        next();
    } catch (error) {
        return res.status(403).send({ message: "You don't have authorization" });
    }
}

module.exports = {
    isAuth
}