'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mesaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mesas',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('aberto', 'fechado', 'pago'),
        defaultValue: 'aberto'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pedidos');
  }
}; 