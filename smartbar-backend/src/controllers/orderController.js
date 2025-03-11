// controllers/orderController.js
const db = require('../models/index');

const orderController = {
  getAllPedidos: async (req, res) => {
    try {
      const pedidos = await db.Pedido.findAll({
        include: [
          {
            model: db.Mesa,
            as: 'mesa',
            attributes: ['numero']
          },
          {
            model: db.PedidoItem,
            as: 'itens',
            include: [{
              model: db.Item,
              as: 'item',
              attributes: ['nome', 'preco', 'categoria']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  getPedidosByMesa: async (req, res) => {
    try {
      const { mesaId } = req.params;
      const pedidos = await db.Pedido.findAll({
        where: { mesaId },
        include: [
          {
            model: db.Mesa,
            as: 'mesa',
            attributes: ['numero']
          },
          {
            model: db.PedidoItem,
            as: 'itens',
            include: [{
              model: db.Item,
              as: 'item',
              attributes: ['nome', 'preco', 'categoria']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  createPedido: async (req, res) => {
    try {
      const { mesaId, itens } = req.body;

      const pedido = await db.Pedido.create({
        mesaId,
        status: 'aberto'
      });

      const pedidoItens = await Promise.all(
        itens.map(async (item) => {
          const itemDb = await db.Item.findByPk(item.itemId);
          return db.PedidoItem.create({
            pedidoId: pedido.id,
            itemId: item.itemId,
            quantidade: item.quantidade,
            preco: itemDb.preco * item.quantidade
          });
        })
      );

      const total = pedidoItens.reduce((acc, item) => acc + Number(item.preco), 0);
      await pedido.update({ total });

      res.status(201).json({
        ...pedido.toJSON(),
        itens: pedidoItens
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  },

  updatePedidoStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const pedido = await db.Pedido.findByPk(id);
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      await pedido.update({ status });
      res.json(pedido);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await db.Pedido.findOne({
        where: { id },
        include: [
          { model: db.Mesa },
          { model: db.PedidoItem }
        ]
      });
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      return res.json(pedido);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  },

  // Novo endpoint para atualizar um pedido
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      // Exemplo: podemos permitir atualizar o status ou o total
      const { status, total } = req.body;

      const pedido = await db.Pedido.findByPk(id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

      // Atualiza os campos se fornecidos
      if (status) pedido.status = status;
      if (total !== undefined) pedido.total = total;

      await pedido.save();
      return res.json(pedido);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  },

  // Novo endpoint para cancelar um pedido
  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await db.Pedido.findByPk(id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      
      // Atualiza o status para "cancelado"
      pedido.status = 'cancelado';
      await pedido.save();
      return res.json({ message: 'Pedido cancelado com sucesso', pedido });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
  }
};

module.exports = orderController;
