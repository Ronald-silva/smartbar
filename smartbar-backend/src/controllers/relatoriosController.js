const { Pedido, PedidoItem, Item } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getResumo = async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 7;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const resultado = await Pedido.findAll({
      where: {
        createdAt: {
          [Op.gte]: dataLimite
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalPedidos'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'totalVendas'],
        [Sequelize.fn('COUNT', Sequelize.literal("CASE WHEN status = 'cancelado' THEN 1 END")), 'pedidosCancelados']
      ],
      raw: true
    });

    const { totalPedidos, totalVendas, pedidosCancelados } = resultado[0] || {};
    
    res.json({
      totalVendas: parseFloat(totalVendas || 0),
      ticketMedio: totalPedidos > 0 ? parseFloat(totalVendas || 0) / totalPedidos : 0,
      totalPedidos: parseInt(totalPedidos || 0),
      pedidosCancelados: parseInt(pedidosCancelados || 0)
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de vendas' });
  }
};

const getItensMaisVendidos = async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 7;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const query = `
      SELECT 
        i.nome,
        i.categoria,
        SUM(pi.quantidade) as quantidade,
        SUM(pi.quantidade * pi.preco) as total
      FROM "pedido_itens" pi
      INNER JOIN "pedidos" p ON p.id = pi."pedidoId"
      INNER JOIN "itens" i ON i.id = pi."itemId"
      WHERE p."createdAt" >= :dataLimite
      AND p.status != 'cancelado'
      GROUP BY i.id, i.nome, i.categoria
      ORDER BY quantidade DESC
      LIMIT 10
    `;

    const itensMaisVendidos = await PedidoItem.sequelize.query(query, {
      replacements: { dataLimite },
      type: Sequelize.QueryTypes.SELECT
    });

    const itensFormatados = itensMaisVendidos.map(item => ({
      nome: item.nome,
      categoria: item.categoria,
      quantidade: parseInt(item.quantidade),
      total: parseFloat(item.total)
    }));

    res.json(itensFormatados);
  } catch (error) {
    console.error('Erro ao buscar itens mais vendidos:', error);
    res.status(500).json({ error: 'Erro ao buscar itens mais vendidos' });
  }
};

const getVendasDiarias = async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 7;
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const vendasDiarias = await Pedido.findAll({
      where: {
        createdAt: {
          [Op.gte]: dataLimite
        },
        status: {
          [Op.ne]: 'cancelado'
        }
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'data'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'total']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'DESC']],
      raw: true
    });

    const vendasFormatadas = vendasDiarias.map(venda => ({
      data: venda.data,
      quantidade: parseInt(venda.quantidade || 0),
      total: parseFloat(venda.total || 0)
    }));

    res.json(vendasFormatadas);
  } catch (error) {
    console.error('Erro ao buscar vendas diárias:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas diárias' });
  }
};

module.exports = {
  getResumo,
  getItensMaisVendidos,
  getVendasDiarias
}; 