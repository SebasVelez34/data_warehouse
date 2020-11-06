import jwt from 'jsonwebtoken';
import config from './utils/config';

const getToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        lastname: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }, config.JWT_SECRET, {
        expiresIn: '12h'
    });
}

export {
    getToken
}