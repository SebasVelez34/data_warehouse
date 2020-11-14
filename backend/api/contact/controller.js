import db, {
	Contacts,
	Contacts_channels,
	City,
	Company,
	Region,
	Country,
} from "../../db/";

const index = async (req, res) => {
	try {
		const contacts = await Contacts.findAll({
			include: [
				{
					model: City,
					include: [
						{
							model: Country,
							include: [Region],
						},
					],
				},
				{
					model: Company,
					include: [City],
				},
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
			const {
				contact_channel = [],
				user_account = [],
				preferences = [],
			} = req.body;
			contact_channel.map(async (channel, index) => {
				try {
					await Contacts_channels.create({
						contact_id: contact.id,
						contact_channel: channel,
						user_account: user_account[index],
						preferences: preferences[index],
					});
				} catch (error) {}
			});
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
			include: [
				{
					model: City,
					include: [
						{
							model: Country,
							include: [Region],
						},
					],
				},
				{
					model: Company,
					include: [City],
				},
				{
					model: Contacts_channels,
				},
			],
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
			const {
				contact_channel = [],
				user_account = [],
				preferences = [],
			} = req.body;
			contact_channel.map(async (channel, index) => {
				try {
					await Contacts_channels.update(
						{
							contact_id: req.body.id,
							contact_channel: channel,
							user_account: user_account[index],
							preferences: preferences[index],
						},
						{
							where: {
								contact_id: req.params.contact,
								contact_channel: channel,
							},
						}
					);
				} catch (error) {
					console.log(error);
				}
			});
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
		const contact_channel = await Contacts_channels.destroy({
			where: { contact_id: req.params.contact },
		});

		if (contact_channel) {
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

const multipleDestroy = (req, res) => {
	try {
		req.body.map(async (id) => {
			try {
				const contact_channel = await Contacts_channels.destroy({
					where: { contact_id: id },
				});
				const contact = await Contacts.destroy({
					where: { id },
				});
			} catch (error) {}
		});
		res.status(200).send({
			msg: "Contact Deleted",
		});
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

export { index, show, store, update, destroy, multipleDestroy };
