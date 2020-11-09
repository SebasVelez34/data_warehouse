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
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		},
		{
			sequelize,
			modelName: "Country",
		}
	);
	Country.associate = (models) => {
		Country.hasMany(models.City, {
			foreignKey: "country_id",
			foreignKeyConstraint: true,
			hooks: true,
			onDelete: 'CASCADE'
		});
		Country.belongsTo(models.Region, {
			foreignKey: "region_id",
			foreignKeyConstraint: true,
			hooks: true,
			onDelete: 'CASCADE'
		});
	};
	return Country;
};
