'use strict';
const {
  Model
} = require('sequelize');
const Country = require('./country');
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {};
  Region.init({
    name: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Region',
  });
  Region.associate = (models) => {
		Region.hasMany(models.Country, {
      foreignKey: "region_id",
      onDelete: 'CASCADE',
      foreignKeyConstraint: true,
      hooks: true
		});
	};
  return Region;
};