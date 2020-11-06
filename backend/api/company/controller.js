import Company from "./model";

const index = async (req, res) => {
	try {
        const companies = await Company.find();
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
		const company = new Company({
			name: req.body.name,
			address: req.body.address,
			email: req.body.email,
			phone: req.body.phone,
			city_id: req.body.city_id,
		});
		if (company) {
			const newCompany = await company.save();
			if (newCompany) {
				res.send({
					id: newCompany.id,
					name: newCompany.name,
					address: newCompany.address,
					email: newCompany.email,
					phone: newCompany.phone,
					city_id: newCompany.city_id,
				});
			} else {
				res.status(500).send({
					msg: "Invalid companies data",
				});
			}
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
			_id: req.params.company,
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
		const company = await Company.findOneAndUpdate(
			{ _id: req.params.company },
			{
				$set: req.body,
			}
		);
		if (company) {
			res.send({
				_id: company.id,
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

const destroy = async (req, res) => {
	try {
		const company = await Company.deleteOne({
			_id: req.params.company,
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
