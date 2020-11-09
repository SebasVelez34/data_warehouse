"use strict";
const { Model } = require("sequelize");
const City = require("./city");
module.exports = (sequelize, DataTypes) => {
	class Company extends Model {}
	Company.init(
		{
			name: {
				type: DataTypes.STRING,
				unique: {
					args: true,
					msg: "Company already exists!",
				},
			},
			address: DataTypes.STRING,
			email: {
        type: DataTypes.STRING,
        validate: {
          isEmail:true
        },
				name: {
					type: DataTypes.STRING,
					unique: {
						args: true,
						msg: "Email address already in use!",
					},
				},
			},
			phone: DataTypes.INTEGER,
			city_id: {
				type: DataTypes.INTEGER,
				references: {
					model: "Cities",
					key: "city_id",
				},
			},
		},
		{
			sequelize,
			modelName: "Company",
		}
	);
	Company.associate = (models) => {
		Company.belongsTo(models.City, {
      foreignKey: "city_id",
      foreignKeyConstraint: true,
			through: "city_id",
		});
	};
	return Company;
};
