import { getToken } from "../../utils";
import db, { Users } from "../../db";

const index = async (req, res) => {
	try {
		const users = await Users.findAll();
		if (users.length === 0) {
			res.status(200).send(users);
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
		const user = await Users.findOne({
			where: { id: req.params.user },
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
	const signinUser = await Users.findOne({
		where: { email: req.body.email, password: req.body.password },
	});
	if (signinUser) {
		res.send({
			_id: signinUser.id,
			name: signinUser.name,
			lastname: signinUser.lastname,
			email: signinUser.email,
			isAdmin: signinUser.isAdmin,
			token: getToken(signinUser),
		});
	} else {
		res.status(500).send({
			msg: "Invalid credentials, please verify",
		});
	}
};

const register = async (req, res) => {
	try {
		const user = await Users.create(req.body);
		if (user) {
			res.send({
				id: user.id,
				name: user.name,
				lastname: user.lastname,
				email: user.email,
				isAdmin: user.isAdmin,
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

const update = async (req, res) => {
	try {
		const user = await Users.update(req.body, {
			where: { id: req.params.user },
		});
		if (user) {
			res.send({
				msg: "User Updated",
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
		const user = await Users.destroy({
			where: { id: req.params.user },
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

export { index, show, update, destroy, signin, register };
