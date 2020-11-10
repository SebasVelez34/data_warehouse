'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts_channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contact_id: {
        type: Sequelize.INTEGER,
        references: {
					model: 'Contacts',
					key: "id",
				},
      },
      contact_channel: {
        type: Sequelize.ENUM,
        values: ['Facebook','Instagram','Whatsapp','Telefono','Correo']
      },
      user_account: {
        type: Sequelize.STRING
      },
      preferences: {
        type: Sequelize.ENUM,
        values: ['Sin preferencia','Canal favorito','No molestar']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contacts_channels');
  }
};