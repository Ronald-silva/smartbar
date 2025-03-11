'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover chaves estrangeiras da tabela pedido_itens
    await queryInterface.removeConstraint('pedido_itens', 'pedido_itens_itemId_fkey');
    await queryInterface.removeConstraint('pedido_itens', 'pedido_itens_pedidoId_fkey');
    
    // Remover chaves estrangeiras da tabela pedidos
    await queryInterface.removeConstraint('pedidos', 'pedidos_mesaId_fkey');
    
    // Remover chaves estrangeiras da tabela pagamentos
    await queryInterface.removeConstraint('pagamentos', 'pagamentos_pedidoId_fkey');
  },

  async down(queryInterface, Sequelize) {
    // Restaurar chaves estrangeiras da tabela pedido_itens
    await queryInterface.addConstraint('pedido_itens', {
      fields: ['itemId'],
      type: 'foreign key',
      name: 'pedido_itens_itemId_fkey',
      references: {
        table: 'itens',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('pedido_itens', {
      fields: ['pedidoId'],
      type: 'foreign key',
      name: 'pedido_itens_pedidoId_fkey',
      references: {
        table: 'pedidos',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Restaurar chaves estrangeiras da tabela pedidos
    await queryInterface.addConstraint('pedidos', {
      fields: ['mesaId'],
      type: 'foreign key',
      name: 'pedidos_mesaId_fkey',
      references: {
        table: 'mesas',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Restaurar chaves estrangeiras da tabela pagamentos
    await queryInterface.addConstraint('pagamentos', {
      fields: ['pedidoId'],
      type: 'foreign key',
      name: 'pagamentos_pedidoId_fkey',
      references: {
        table: 'pedidos',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
}; 