"use strict";
const { Model } = require("sequelize");
const City = require("./city");
const Region = require("./region");
module.exports = (sequelize, DataTypes) => {
	class Country extends Model {}
	Country.init(
		{
			name: DataTypes.STRING,
			region_id: {
				type: DataTypes.INTEGER,
				references: {
					model: Region,
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "Country",
		}
	);
	return Country;
};
