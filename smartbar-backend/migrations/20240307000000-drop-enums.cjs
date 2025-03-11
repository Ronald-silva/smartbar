'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_mesas_status CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_pedidos_status CASCADE;');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE enum_mesas_status AS ENUM ('disponivel', 'ocupada');
      CREATE TYPE enum_pedidos_status AS ENUM ('aberto', 'fechado', 'pago');
    `);
  }
}; 