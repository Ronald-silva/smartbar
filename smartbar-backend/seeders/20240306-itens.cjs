'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('itens', [
      {
        nome: 'Espetinho Misto',
        descricao: 'O clássico espetinho com pedaços suculentos de carne bovina, frango, linguiça e coração. Temperado com sal e especiarias.',
        preco: 12.90,
        categoria: 'Espetinhos',
        disponivel: true,
        foto_url: '/images/espetinho-misto.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Espetinho de Picanha',
        descricao: 'Suculentos cubos de picanha premium, temperados com sal grosso e grelhados no ponto. Acompanha farofa.',
        preco: 18.90,
        categoria: 'Espetinhos',
        disponivel: true,
        foto_url: '/images/espetinho-picanha.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Pão de Alho Premium',
        descricao: 'Pão artesanal recheado com manteiga temperada, alho assado e queijo gratinado. Porção com 6 unidades.',
        preco: 24.90,
        categoria: 'Entradas e Petiscos',
        disponivel: true,
        foto_url: '/images/pao-alho.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Batata Frita Crocante',
        descricao: 'Batatas selecionadas, cortadas em palitos grossos e fritas até ficarem douradas. Acompanha molho especial da casa. Serve 2 pessoas.',
        preco: 29.90,
        categoria: 'Entradas e Petiscos',
        disponivel: true,
        foto_url: '/images/batata-frita.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Coca-Cola',
        descricao: 'Refrigerante Coca-Cola 350ml',
        preco: 6.90,
        categoria: 'Bebidas',
        disponivel: true,
        foto_url: '/images/coca-cola.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Heineken',
        descricao: 'Cerveja Heineken Long Neck 330ml',
        preco: 12.90,
        categoria: 'Cervejas',
        disponivel: true,
        foto_url: '/images/heineken.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Caipirinha de Limão',
        descricao: 'Caipirinha clássica feita com cachaça de qualidade, limão tahiti, açúcar e gelo.',
        preco: 18.90,
        categoria: 'Caipirinhas',
        disponivel: true,
        foto_url: '/images/caipirinha-limao.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('itens', null, {});
  }
}; 