import db,{ Region, Country, City } from '../../db';

import mongoose from "mongoose";
const index = async (req, res) => {
	try {
		const locations = await Region.findAll({
            include:[
                {model: Country, include: [City] }
            ]
        });
		if (locations.length === 0) {
			res.status(204).send(locations);
		}
		res.send(locations);
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const storeRegion = async (req, res) => {
	try {
		const region = new Region({
			name: req.body.name,
		});
		if (region) {
			const newRegion = await region.save();
			if (newRegion) {
				res.status(200).send({
					id: newRegion._id,
					name: newRegion.name,
				});
			}
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const storeCountry = async (req, res) => {
	try {
		const country = new Country({
			name: req.body.name,
			region_id: req.body.region_id,
		});
		if (country) {
			const newCountry = await country.save();
			if (newCountry) {
				res.status(200).send({
					id: newCountry._id,
					name: newCountry.name,
					region_id: newCountry.region_id,
				});
			}
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const storeCity = async (req, res) => {
	try {
		const city = new City({
			name: req.body.name,
			country_id: req.body.country_id,
		});
		if (city) {
			const newCity = await city.save();
			if (newCity) {
				res.status(200).send({
					id: newCity._id,
					name: newCity.name,
					country_id: newCity.country_id,
				});
			}
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const showRegion = async (req, res) => {
	try {
		const location = await Region.findOne({
            where: { id: req.params.region },
            include:[
                Country,
            ]
		});
		if (location) {
			res.send(location);
		} else {
			res.status(500).send({
				msg: "Error finding region",
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const showCountry = async (req, res) => {
	try {
		const country = await Country.findOne({
            where: { id: req.params.country },
            include:[
                City,
            ]
		});
		if (country) {
			res.send(country);
		} else {
			res.status(500).send({
				msg: "Error finding country",
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const showCity = async (req, res) => {
	try {
		const city = await City.findOne({
            where: { id: req.params.city },
            include:[
                Country
            ]
		});
		if (city) {
			res.send(city);
		} else {
			res.status(500).send({
				msg: "Error finding city",
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const cities = async (req, res) => {
	try {
		const cities = await City.findAll();
		if (cities) {
			res.send(cities);
		} else {
			res.status(500).send({
				msg: "Error finding cities",
			});
		}
	} catch (error) {
		res.status(500).send({
			error: error,
		});
	}
};

const update = async (req, res) => {
	try {
		const location = await Location.findOneAndUpdate(
			{ _id: req.params.location },
			{
				$set: req.body,
			}
		);
		if (location) {
			res.send({
				_id: location.id,
				locations: location.locations,
				region: location.region,
			});
		} else {
			res.status(500).send({
				msg: "Invalid locations data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const destroyRegion = async (req, res) => {
	try {
		const location = await Region.destroy({
			where: { id: req.params.region },
		});
		if (location) {
			res.status(200).send({
				msg: "Region Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid Region data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const destroyCountry = async (req, res) => {
	try {
		const location = await Country.destroy({
			where: { id: req.params.country, region_id: req.body.region_id },
		});
		if (location) {
			res.status(200).send({
				msg: "Country Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid Country data",
			});
		}
	} catch (error) {
		res.status(500).send({
			msg: error.message,
		});
	}
};

const destroyCity = async (req, res) => {
	try {
		const location = await City.destroy({
			where: { id: req.params.region, country_id: req.body.country_id },
		});
		if (location) {
			res.status(200).send({
				msg: "City Deleted",
			});
		} else {
			res.status(500).send({
				msg: "Invalid City data",
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
	storeRegion,
	storeCountry,
	storeCity,
	showRegion,
	showCountry,
	showCity,
	update,
    destroyRegion,
    destroyCountry,
    destroyCity,
    cities
};
