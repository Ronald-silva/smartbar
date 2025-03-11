'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('itens', 'imagem', {
        type: Sequelize.STRING,
        defaultValue: '/images/placeholder.jpg'
      });
    } catch (error) {
      console.log('Erro ao adicionar coluna:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('itens', 'imagem');
    } catch (error) {
      console.log('Erro ao remover coluna:', error);
    }
  }
}; 