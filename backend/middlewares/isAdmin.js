'use strict'

function isAdmin(req, res, next) {
    if(!req.user.isAdmin || req.user.isAdmin === 0){
        return res.status(403).send({ message: "You don't have authorization, you aren't admin" });
    }
    next();

}

module.exports = {
    isAdmin
}