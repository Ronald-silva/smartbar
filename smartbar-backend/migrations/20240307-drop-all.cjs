'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS pedido_itens CASCADE;
      DROP TABLE IF EXISTS pagamentos CASCADE;
      DROP TABLE IF EXISTS pedidos CASCADE;
      DROP TABLE IF EXISTS itens CASCADE;
      DROP TABLE IF EXISTS mesas CASCADE;
      DROP TYPE IF EXISTS enum_mesas_status;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Recriar tabelas na ordem correta
    await queryInterface.sequelize.query(`
      CREATE TYPE enum_mesas_status AS ENUM ('disponivel', 'ocupada');
      
      CREATE TABLE mesas (
        id SERIAL PRIMARY KEY,
        numero INTEGER NOT NULL UNIQUE,
        status enum_mesas_status NOT NULL DEFAULT 'disponivel',
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );

      CREATE TABLE itens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(255) NOT NULL,
        disponivel BOOLEAN DEFAULT true,
        foto_url VARCHAR(255),
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );

      CREATE TABLE pedidos (
        id SERIAL PRIMARY KEY,
        "mesaId" INTEGER NOT NULL REFERENCES mesas(id),
        status VARCHAR(255) NOT NULL DEFAULT 'aberto',
        total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );

      CREATE TABLE pedido_itens (
        id SERIAL PRIMARY KEY,
        "pedidoId" INTEGER NOT NULL REFERENCES pedidos(id),
        "itemId" INTEGER NOT NULL REFERENCES itens(id),
        quantidade INTEGER NOT NULL DEFAULT 1,
        "precoUnitario" DECIMAL(10,2) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );

      CREATE TABLE pagamentos (
        id SERIAL PRIMARY KEY,
        "pedidoId" INTEGER NOT NULL REFERENCES pedidos(id),
        metodo VARCHAR(255) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'pendente',
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      );
    `);
  }
}; 