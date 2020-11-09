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
        key: "id",
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
      foreignKey: "id",
      foreignKeyConstraint: true,
      onDelete: 'CASCADE',
      hooks: true
		});
	};
  return City;
};