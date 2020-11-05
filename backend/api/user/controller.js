import {
    getToken
} from '../../utils';
import User from './model';

const index = async (req, res) => {
	try {
        const users = await User.find();
		if (users.length === 0) {
			res.status(204).send(users);
        }
        res.status(200).send(users);
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const show = async (req, res) => {
	try {
		const user = await User.findOne({
			_id: req.params.user,
		});
		if (user) {
			res.status(200).send(user);
		} else {
			res.status(204).send(user);
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};


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
        res.status(500).send({
            msg: "Invalid credentials, please verify"
        });
    }
};

const register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
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
            res.status(500).send({
                msg: "Invalid user data"
            });
        }
    } catch (error) {
        res.status(500).send({
            msg: error.message
        });
    }
}

const update = async (req, res) => {
	try {
		const user = await User.findOneAndUpdate(
			{ _id: req.params.user },
			{
				$set: req.body,
			}
		);
		if (user) {
			res.send({
				_id: user.id,
				name: user.name,
				lastname: user.lastname,
				email: user.email,
				isAdmin: user.isAdmin
			});
		} else {
			res.status(500).send({
				msg: "Invalid user data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const destroy = async (req, res) => {
	try {
		const user = await User.deleteOne({
			_id: req.params.user,
		});
		if (user) {
			res.status(200).send({
				msg: "User Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid user data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

export {
    index,
    show,
    update,
    destroy,
    signin,
    register
}