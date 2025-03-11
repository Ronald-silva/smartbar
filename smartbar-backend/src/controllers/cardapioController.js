const db = require('../models/index');

const cardapioController = {
  // Listar todos os itens do cardápio
  getMenu: async (req, res) => {
    try {
      const itens = await db.Item.findAll({
        attributes: ['id', 'nome', 'descricao', 'preco', 'categoria', 'imagem'],
        where: {
          disponivel: true
        },
        order: [
          ['categoria', 'ASC'],
          ['nome', 'ASC']
        ]
      });

      // Convertendo o preço para número antes de enviar
      const itensFormatados = itens.map(item => ({
        ...item.toJSON(),
        preco: Number(item.preco)
      }));

      res.json(itensFormatados);
    } catch (error) {
      console.error('Erro ao buscar itens do cardápio:', error);
      res.status(500).json({ error: 'Erro ao buscar itens do cardápio' });
    }
  },

  // Criar novo item no cardápio
  createMenuItem: async (req, res) => {
    try {
      const { nome, descricao, preco, categoria, imagem } = req.body;

      // Validações básicas
      if (!nome || !descricao || !preco || !categoria) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios: nome, descricao, preco, categoria' 
        });
      }

      const novoItem = await db.Item.create({
        nome,
        descricao,
        preco,
        categoria,
        imagem: imagem || '/images/placeholder.jpg',
        disponivel: true
      });

      res.status(201).json(novoItem);
    } catch (error) {
      console.error('Erro ao criar item do cardápio:', error);
      res.status(500).json({ error: 'Erro ao criar item do cardápio' });
    }
  },

  // Atualizar item do cardápio
  updateMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, categoria, imagem, disponivel } = req.body;

      const item = await db.Item.findByPk(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      await item.update({
        nome: nome || item.nome,
        descricao: descricao || item.descricao,
        preco: preco || item.preco,
        categoria: categoria || item.categoria,
        imagem: imagem || item.imagem,
        disponivel: disponivel !== undefined ? disponivel : item.disponivel
      });

      res.json(item);
    } catch (error) {
      console.error('Erro ao atualizar item do cardápio:', error);
      res.status(500).json({ error: 'Erro ao atualizar item do cardápio' });
    }
  },

  // Excluir item do cardápio
  deleteMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      
      const item = await db.Item.findByPk(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      // Verifica se o item está em algum pedido
      const pedidosComItem = await db.PedidoItem.count({
        where: { itemId: id }
      });

      if (pedidosComItem > 0) {
        // Se o item estiver em pedidos, apenas marca como indisponível
        await item.update({ disponivel: false });
        return res.json({ message: 'Item marcado como indisponível' });
      }

      // Se não estiver em pedidos, remove completamente
      await item.destroy();
      res.json({ message: 'Item removido com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir item do cardápio:', error);
      res.status(500).json({ error: 'Erro ao excluir item do cardápio' });
    }
  }
};

module.exports = cardapioController; 