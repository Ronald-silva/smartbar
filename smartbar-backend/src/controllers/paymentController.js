// controllers/paymentController.js
const db = require('../models/index');

// Lista de métodos de pagamento permitidos
const allowedMethods = ['pix', 'cartao_credito', 'cartao_debito', 'dinheiro'];

const paymentController = {
  processPayment: async (req, res) => {
    try {
      const { pedidoId, valor, metodo } = req.body;

      const pedido = await db.Pedido.findByPk(pedidoId);
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if (pedido.status === 'pago') {
        return res.status(400).json({ error: 'Pedido já foi pago' });
      }

      const pagamento = await db.Pagamento.create({
        pedidoId,
        valor,
        metodo,
        status: 'aprovado'
      });

      await pedido.update({ status: 'pago' });

      res.json(pagamento);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      const { pedidoId } = req.params;

      const pagamento = await db.Pagamento.findOne({
        where: { pedidoId }
      });

      if (!pagamento) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      res.json(pagamento);
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error);
      res.status(500).json({ error: 'Erro ao buscar status do pagamento' });
    }
  }
};

module.exports = paymentController;
