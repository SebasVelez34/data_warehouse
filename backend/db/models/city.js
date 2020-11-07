'use strict';
const {
  Model
} = require('sequelize');
const Country = require('./country');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {};
  City.init({
    name: DataTypes.STRING,
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Countries',
        key: "id",
      },
    },
  }, {
    sequelize,
    modelName: 'City',
  });
  City.associate = (models) => {
		City.belongsTo(models.Country, {
			foreignKey: "id"
		});
	};
  return City;
};