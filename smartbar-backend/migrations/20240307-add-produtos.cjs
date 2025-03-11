'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('itens', [
      {
        nome: 'Espetinho de Picanha',
        descricao: 'Suculento espeto de picanha bovina grelhada no ponto',
        preco: 15.90,
        categoria: 'Espetos',
        imagem: '/images/espeto-picanha.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Espetinho de Frango',
        descricao: 'Espeto de peito de frango temperado e grelhado',
        preco: 12.90,
        categoria: 'Espetos',
        imagem: '/images/espeto-frango.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Chopp Brahma',
        descricao: 'Chopp claro gelado (300ml)',
        preco: 8.90,
        categoria: 'Bebidas',
        imagem: '/images/chopp.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Caipirinha',
        descricao: 'Caipirinha de limão com cachaça artesanal',
        preco: 14.90,
        categoria: 'Bebidas',
        imagem: '/images/caipirinha.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Porção de Batata Frita',
        descricao: 'Porção grande de batatas fritas crocantes',
        preco: 24.90,
        categoria: 'Porções',
        imagem: '/images/batata-frita.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Espetinho de Linguiça',
        descricao: 'Espeto de linguiça defumada grelhada',
        preco: 13.90,
        categoria: 'Espetos',
        imagem: '/images/espeto-linguica.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Refrigerante Lata',
        descricao: 'Coca-Cola, Guaraná ou Sprite (350ml)',
        preco: 6.90,
        categoria: 'Bebidas',
        imagem: '/images/refrigerante.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Porção de Calabresa',
        descricao: 'Porção de calabresa acebolada',
        preco: 28.90,
        categoria: 'Porções',
        imagem: '/images/porcao-calabresa.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Água Mineral',
        descricao: 'Água mineral sem gás (500ml)',
        preco: 4.90,
        categoria: 'Bebidas',
        imagem: '/images/agua.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Espetinho de Coração',
        descricao: 'Espeto de coração de frango temperado',
        preco: 13.90,
        categoria: 'Espetos',
        imagem: '/images/espeto-coracao.jpg',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('itens', null, {});
  }
}; 