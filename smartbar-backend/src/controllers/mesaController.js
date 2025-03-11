const db = require('../models/index');

const mesaController = {
  // Listar todas as mesas
  getMesas: async (req, res) => {
    try {
      const mesas = await db.Mesa.findAll({
        order: [['numero', 'ASC']]
      });
      res.json(mesas);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      res.status(500).json({ error: 'Erro ao buscar mesas' });
    }
  },

  // Atualizar status da mesa
  updateMesaStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const mesa = await db.Mesa.findByPk(id);
      
      if (!mesa) {
        return res.status(404).json({ error: 'Mesa não encontrada' });
      }

      if (!['disponivel', 'ocupada'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      await mesa.update({ status });
      res.json(mesa);
    } catch (error) {
      console.error('Erro ao atualizar status da mesa:', error);
      res.status(500).json({ error: 'Erro ao atualizar status da mesa' });
    }
  }
};

module.exports = mesaController; 