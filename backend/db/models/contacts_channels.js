'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contacts_channels extends Model {};
  Contacts_channels.init({
    contact_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Contacts",
        key: "id",
      },
    },
    contact_channel: DataTypes.STRING,
    user_account: DataTypes.STRING,
    preferences: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contacts_channels',
  });
  Contacts_channels.associate = (models) => {
		Contacts_channels.belongsTo(models.Contacts, {
			foreignKey: "contact_id",
			foreignKeyConstraint: true,
			hooks: true,
			onDelete: 'CASCADE'
		});
	};
  return Contacts_channels;
};