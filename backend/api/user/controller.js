import { getToken } from "../../utils";
import db, { Users } from "../../db";
const bcrypt = require('bcrypt');
import { createToken, validatePassword } from "../../utils/config.js";

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
		where: { email: req.body.email},
	});
	if (signinUser) {
		const { id, name, lastname, email, isAdmin, password } = signinUser;
		if(!validatePassword(password, req.body.password)){
			res.status(500).send({
				msg: "Invalid credentials, please verify",
			});
		}
		const token = createToken({ id, email, isAdmin });
		res.send({
			_id: id,
			name: name,
			lastname: lastname,
			email: email,
			isAdmin: isAdmin,
			token,
		});
	} else {
		res.status(500).send({
			msg: "Invalid credentials, please verify",
		});
	}
};

const register = async (req, res) => {
	try {
		req.body.password = bcrypt.hashSync(req.body.password, 10);
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
				name: req.params.user,
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
