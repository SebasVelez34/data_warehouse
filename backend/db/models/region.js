'use strict';
const {
  Model
} = require('sequelize');
const Country = require('./country');
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {};
  Region.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Region',
  });
  Region.associate = (models) => {
		Region.hasMany(models.Country, {
      foreignKey: "region_id",
      onDelete: 'CASCADE'
		});
	};
  return Region;
};