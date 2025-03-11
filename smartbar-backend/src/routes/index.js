const express = require('express');
const router = express.Router();
const mesaRoutes = require('./mesaRoutes');
const itemRoutes = require('./itemRoutes');
const pedidoRoutes = require('./pedidoRoutes');
const pagamentoRoutes = require('./pagamentoRoutes');
const divisaoContaRoutes = require('./divisaoContaRoutes');
const relatoriosRoutes = require('./relatoriosRoutes');

router.use('/mesas', mesaRoutes);
router.use('/cardapio', itemRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/divisao-conta', divisaoContaRoutes);
router.use('/relatorios', relatoriosRoutes);

module.exports = router; 