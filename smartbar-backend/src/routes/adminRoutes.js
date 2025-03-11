import { Router } from 'express';
import db from '../models/index.js';
import { isAdminJWT } from '../middleware/isAdminJWT.js';

const router = Router();

// Middleware de autenticação para todas as rotas administrativas
router.use(isAdminJWT);

// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Configurar período (hoje)
    const hoje = new Date();
    const inicioHoje = new Date(hoje.setHours(0, 0, 0, 0));
    const fimHoje = new Date(hoje.setHours(23, 59, 59, 999));

    // Buscar métricas de pedidos
    const [pedidosDiarios, faturamentoDiario, pedidosEmAberto] = await Promise.all([
      // Total de pedidos do dia
      db.Pedido.count({
        where: {
          createdAt: {
            [db.Sequelize.Op.between]: [inicioHoje, fimHoje]
          }
        }
      }),
      // Faturamento total dos pedidos fechados
      db.Pedido.sum('total', {
        where: {
          status: 'fechado',
          createdAt: {
            [db.Sequelize.Op.between]: [inicioHoje, fimHoje]
          }
        }
      }),
      // Pedidos em aberto no momento
      db.Pedido.count({
        where: {
          status: 'aberto'
        }
      })
    ]);

    // Buscar métricas de mesas
    const [mesasTotal, mesasOcupadas] = await Promise.all([
      db.Mesa.count(),
      db.Mesa.count({
        where: { status: 'ocupada' }
      })
    ]);

    // Calcular ticket médio (evitando divisão por zero)
    const ticketMedio = pedidosDiarios > 0 ? (faturamentoDiario / pedidosDiarios) : 0;

    // Formatar resposta
    res.json({
      pedidos: {
        total: pedidosDiarios,
        emAberto: pedidosEmAberto,
        ticketMedio: Number(ticketMedio.toFixed(2))
      },
      mesas: {
        total: mesasTotal,
        ocupadas: mesasOcupadas,
        disponiveis: mesasTotal - mesasOcupadas,
        taxaOcupacao: Number(((mesasOcupadas / mesasTotal) * 100).toFixed(2))
      },
      faturamento: {
        diario: Number(faturamentoDiario?.toFixed(2)) || 0
      },
      periodo: {
        inicio: inicioHoje,
        fim: fimHoje
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      error: 'Erro ao buscar dados do dashboard',
      details: error.message
    });
  }
});

// Listar e Filtrar Pedidos
router.get('/orders', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = {};

    // Aplicar filtros se fornecidos
    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [db.Sequelize.Op.between]: [
          new Date(startDate),
          new Date(endDate)
        ]
      };
    }

    const pedidos = await db.Pedido.findAll({
      where,
      include: [
        { 
          model: db.Mesa,
          attributes: ['numero', 'status']
        },
        { 
          model: db.PedidoItem,
          include: [{
            model: db.Item,
            attributes: ['nome', 'preco', 'categoria']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({
      error: 'Erro ao buscar pedidos',
      details: error.message
    });
  }
});

// Atualizar Pedido
router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, total } = req.body;

    const pedido = await db.Pedido.findByPk(id, {
      include: [
        { model: db.Mesa },
        { 
          model: db.PedidoItem,
          include: [db.Item]
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    // Atualizar campos do pedido
    await pedido.update({
      status: status || pedido.status,
      total: total || pedido.total
    });

    // Se o pedido for fechado, liberar a mesa
    if (status === 'fechado' && pedido.Mesa) {
      await pedido.Mesa.update({ status: 'livre' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({
      error: 'Erro ao atualizar pedido',
      details: error.message
    });
  }
});

// Cancelar Pedido
router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await db.Pedido.findByPk(id, {
      include: [{ model: db.Mesa }]
    });

    if (!pedido) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    // Atualizar status do pedido para cancelado
    await pedido.update({ status: 'cancelado' });

    // Liberar a mesa se estiver ocupada
    if (pedido.Mesa && pedido.Mesa.status === 'ocupada') {
      await pedido.Mesa.update({ status: 'livre' });
    }

    res.json({
      message: 'Pedido cancelado com sucesso',
      pedido
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({
      error: 'Erro ao cancelar pedido',
      details: error.message
    });
  }
});

// Gerenciamento do Cardápio

// Listar todos os itens do cardápio
router.get('/menu', async (req, res) => {
  try {
    const itens = await db.Item.findAll({
      attributes: ['id', 'nome', 'descricao', 'preco', 'categoria', 'foto_url', 'disponivel'],
      order: [
        ['categoria', 'ASC'],
        ['nome', 'ASC']
      ]
    });

    res.json({
      total: itens.length,
      itens
    });
  } catch (error) {
    console.error('Erro ao listar itens do cardápio:', error);
    res.status(500).json({
      error: 'Erro ao buscar itens do cardápio',
      details: error.message
    });
  }
});

// Criar novo item no cardápio
router.post('/menu', async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, foto_url } = req.body;

    // Validação básica
    if (!nome || !preco || !categoria) {
      return res.status(400).json({
        error: 'Dados incompletos',
        details: 'Nome, preço e categoria são obrigatórios'
      });
    }

    const novoItem = await db.Item.create({
      nome,
      descricao,
      preco: Number(preco),
      categoria,
      foto_url,
      disponivel: true
    });

    res.status(201).json({
      message: 'Item criado com sucesso',
      item: novoItem
    });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({
      error: 'Erro ao criar item no cardápio',
      details: error.message
    });
  }
});

// Atualizar item do cardápio
router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, foto_url, disponivel } = req.body;

    const item = await db.Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado',
        details: `Não foi encontrado item com o ID ${id}`
      });
    }

    // Atualiza apenas os campos fornecidos
    const dadosAtualizacao = {};
    if (nome) dadosAtualizacao.nome = nome;
    if (descricao) dadosAtualizacao.descricao = descricao;
    if (preco) dadosAtualizacao.preco = Number(preco);
    if (categoria) dadosAtualizacao.categoria = categoria;
    if (foto_url) dadosAtualizacao.foto_url = foto_url;
    if (disponivel !== undefined) dadosAtualizacao.disponivel = disponivel;

    await item.update(dadosAtualizacao);

    res.json({
      message: 'Item atualizado com sucesso',
      item
    });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({
      error: 'Erro ao atualizar item no cardápio',
      details: error.message
    });
  }
});

// Deletar item do cardápio
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado',
        details: `Não foi encontrado item com o ID ${id}`
      });
    }

    // Verifica se existem pedidos relacionados
    const pedidosRelacionados = await db.PedidoItem.count({
      where: { itemId: id }
    });

    if (pedidosRelacionados > 0) {
      // Em vez de deletar, marca como indisponível
      await item.update({ disponivel: false });
      return res.json({
        message: 'Item marcado como indisponível',
        details: 'O item possui histórico de pedidos e não pode ser excluído'
      });
    }

    await item.destroy();
    res.json({
      message: 'Item excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({
      error: 'Erro ao deletar item do cardápio',
      details: error.message
    });
  }
});

export default router;