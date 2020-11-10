"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Users extends Model {}
	Users.init(
		{
			name: DataTypes.STRING,
			lastname: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				validate: {
					isEmail: true,
				},
				name: {
					type: DataTypes.STRING,
					unique: {
						args: true,
						msg: "Email address already in use!",
					},
				},
			},
			password: DataTypes.STRING,
			isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
		},
		{
			sequelize,
			modelName: "Users",
		}
	);
	return Users;
};
