// routes/api.js
const express = require('express');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const billSplitController = require('../controllers/billSplitController');
const mesaController = require('../controllers/mesaController');
const cardapioController = require('../controllers/cardapioController');
const relatoriosController = require('../controllers/relatoriosController');

const router = express.Router();

// Rotas para mesas
router.get('/mesas', mesaController.getMesas);
router.put('/mesas/:id', mesaController.updateMesaStatus);

// Rotas para cardápio
router.get('/cardapio', cardapioController.getMenu);
router.post('/cardapio', cardapioController.createMenuItem);
router.put('/cardapio/:id', cardapioController.updateMenuItem);
router.delete('/cardapio/:id', cardapioController.deleteMenuItem);

// Rotas para pedidos
router.get('/pedidos', orderController.getAllPedidos);
router.get('/pedidos/mesa/:mesaId', orderController.getPedidosByMesa);
router.post('/pedidos', orderController.createPedido);
router.put('/pedidos/:id/status', orderController.updatePedidoStatus);

// Rotas para pagamento
router.post('/pagamentos', paymentController.processPayment);
router.get('/pagamentos/pedido/:pedidoId', paymentController.getPaymentStatus);

// Rotas para divisão de conta
router.post('/conta/dividir', billSplitController.splitBill);
router.get('/conta/divisao/:divisaoId', billSplitController.getDivisaoStatus);

// Rotas para relatórios
router.get('/relatorios/resumo', relatoriosController.getResumo);
router.get('/relatorios/itens-mais-vendidos', relatoriosController.getItensMaisVendidos);
router.get('/relatorios/vendas-diarias', relatoriosController.getVendasDiarias);

module.exports = router;
