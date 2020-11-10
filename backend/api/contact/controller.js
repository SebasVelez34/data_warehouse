import db, { Contacts, City, Company, Region, Country } from "../../db/";

const index = async (req, res) => {
	try {
		const contacts = await Contacts.findAll({
			include: [
				{
					model: City,
					include: [
						{
							model: Country,
							include: [ Region ]
						},
					],
				},
				{
					model: Company,
					include: [ City ]
				}
			],
		});
		if (contacts.length === 0) {
			res.status(204).send(contacts);
		}
		res.status(200).send(contacts);
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const store = async (req, res) => {
	try {
		const contact = await Contacts.create(req.body);
		if (contact) {
			res.send(contact);
		} else {
			res.status(500).send({
				msg: "Invalid contacts data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const show = async (req, res) => {
	try {
		const contact = await Contacts.findOne({
			where: { id: req.params.contact },
			include: [City, Company],
		});
		if (contact) {
			res.status(200).send(contact);
		} else {
			res.status(204).send(contact);
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const update = async (req, res) => {
	try {
		const contact = await Contacts.update(req.body, {
			where: { id: req.params.contact },
		});
		if (contact) {
			res.send({
				name: req.params.contact,
				msg: "Updated",
			});
		} else {
			res.status(500).send({
				msg: "Invalid contacts data",
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
		const contact = await Contacts.destroy({
			where: { id: req.params.contact },
		});
		if (contact) {
			res.status(200).send({
				msg: "Contact Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid contact data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

export { index, show, store, update, destroy };
