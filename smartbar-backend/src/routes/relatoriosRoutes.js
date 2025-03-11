const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');

router.get('/resumo', relatoriosController.getResumo);
router.get('/itens-mais-vendidos', relatoriosController.getItensMaisVendidos);
router.get('/vendas-diarias', relatoriosController.getVendasDiarias);

module.exports = router; 