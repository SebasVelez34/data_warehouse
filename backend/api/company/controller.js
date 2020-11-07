import db, { Company,City } from "../../db/";

const index = async (req, res) => {
	try {
		const companies = await Company.findAll({
			include: [
				City
			],
		});
		if (companies.length === 0) {
			res.status(204).send(companies);
		}
		res.status(200).send(companies);
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const store = async (req, res) => {
	try {
		const company = await Company.create(req.body);
		if (company) {
			res.send({
				id: company.id,
				name: company.name,
				address: company.address,
				email: company.email,
				phone: company.phone,
				city_id: company.city_id,
			});
		} else {
			res.status(500).send({
				msg: "Invalid companies data",
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
		const company = await Company.findOne({
			where: {id : req.params.company},
			include: [
				City
			],
		});
		if (company) {
			res.status(200).send(company);
		} else {
			res.status(204).send(company);
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const update = async (req, res) => {
	try {
		const company = await Company.update(req.body, {
			where: { id: req.params.company },
		});
		if (company) {
			res.send({
				name: req.params.company,
				msg: "Updated"
			});
		} else {
			res.status(500).send({
				msg: "Invalid companies data",
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
		const company = await Company.destroy({
			where: { id: req.params.company},
		});
		if (company) {
			res.status(200).send({
				msg: "Company Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid companies data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

export { index, show, store, update, destroy };
