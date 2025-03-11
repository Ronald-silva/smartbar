// controllers/billSplitController.js
const db = require('../models/index');

const billSplitController = {
  splitBill: async (req, res) => {
    try {
      const { pedidoId, divisoes } = req.body;

      const pedido = await db.Pedido.findByPk(pedidoId, {
        include: [{
          model: db.PedidoItem,
          include: [db.Item]
        }]
      });

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if (pedido.status === 'pago') {
        return res.status(400).json({ error: 'Pedido já foi pago' });
      }

      // Calcula o valor total de cada divisão
      const divisoesProcessadas = divisoes.map(divisao => {
        const total = divisao.itens.reduce((acc, item) => {
          const pedidoItem = pedido.PedidoItens.find(pi => pi.id === item.pedidoItemId);
          if (!pedidoItem) return acc;
          return acc + (pedidoItem.preco * (item.percentual / 100));
        }, 0);

        return {
          ...divisao,
          total
        };
      });

      // Cria o registro de divisão
      const divisaoConta = await db.DivisaoConta.create({
        pedidoId,
        divisoes: divisoesProcessadas,
        status: 'pendente'
      });

      res.json(divisaoConta);
    } catch (error) {
      console.error('Erro ao dividir conta:', error);
      res.status(500).json({ error: 'Erro ao dividir conta' });
    }
  },

  getDivisaoStatus: async (req, res) => {
    try {
      const { divisaoId } = req.params;

      const divisao = await db.DivisaoConta.findByPk(divisaoId);

      if (!divisao) {
        return res.status(404).json({ error: 'Divisão não encontrada' });
      }

      res.json(divisao);
    } catch (error) {
      console.error('Erro ao buscar status da divisão:', error);
      res.status(500).json({ error: 'Erro ao buscar status da divisão' });
    }
  }
};

module.exports = billSplitController;
