'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('mesas', [
      { numero: 1, status: 'disponivel', createdAt: now, updatedAt: now },
      { numero: 2, status: 'disponivel', createdAt: now, updatedAt: now },
      { numero: 3, status: 'disponivel', createdAt: now, updatedAt: now },
      { numero: 4, status: 'disponivel', createdAt: now, updatedAt: now },
      { numero: 5, status: 'disponivel', createdAt: now, updatedAt: now },
      { numero: 6, status: 'disponivel', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mesas', null, {});
  }
}; 