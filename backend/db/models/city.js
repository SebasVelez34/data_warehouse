'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {};
  City.init({
    name: DataTypes.STRING,
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Countries',
        key: "country_id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'City',
  });
  City.associate = (models) => {
		City.belongsTo(models.Country, {
      foreignKey: "country_id",
      foreignKeyConstraint: true,
      onDelete: 'CASCADE',
      hooks: true
		});
	};
  return City;
};