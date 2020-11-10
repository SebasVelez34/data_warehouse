'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contacts extends Model {};
  Contacts.init({
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    position: DataTypes.STRING,
    email: DataTypes.STRING,
    company_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Companies",
        key: "company_id",
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cities",
        key: "city_id",
      },
    },
    address: DataTypes.STRING,
    interest: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contacts',
  });
  Contacts.associate = (models) => {
		Contacts.hasMany(models.Contacts_channels, {
			foreignKey: "contact_id",
			foreignKeyConstraint: true,
			hooks: true,
			onDelete: 'CASCADE'
    });
    Contacts.belongsTo(models.City, {
			foreignKey: "city_id",
			foreignKeyConstraint: true,
			through: "city_id",
    });
    Contacts.belongsTo(models.Company, {
			foreignKey: "company_id",
			foreignKeyConstraint: true,
			through: "company_id",
		});
	};
  return Contacts;
};