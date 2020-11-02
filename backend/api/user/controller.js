import {
    getToken
} from '../../utils';
import User from './model';

const signin = async (req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (signinUser) {
        res.send({
            _id: signinUser.id,
            name: signinUser.name,
            lastname: signinUser.lastname,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: getToken(signinUser)
        })
    } else {
        res.status(401).send({
            msg: "Invalid credentials, please verify"
        });
    }
};

const register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const newUser = await user.save();
        if (newUser) {
            res.send({
                _id: newUser.id,
                name: newUser.name,
                lastname: newUser.lastname,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            })
        } else {
            res.status(401).send({
                msg: "Invalid user data"
            });
        }
    } catch (error) {
        res.status(401).send({
            msg: error.message
        });
    }
}


export {
    signin,
    register
}