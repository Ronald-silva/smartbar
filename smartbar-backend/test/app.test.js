// test/app.test.js
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import db from '../src/models/index.js';

describe('Testes de Pagamento - SmartBar API', function() {
  // Antes de todos os testes, sincroniza o banco
  before(async function() {
    this.timeout(10000);
    await db.sequelize.sync({ force: true });
  });
  
  // Antes de cada teste, recria as tabelas para garantir isolamento
  beforeEach(async function() {
    await db.sequelize.sync({ force: true });
  });
  
  it('Processa pagamento via PIX (POST /api/payments)', async function() {
    // Cria dados de teste: mesa e pedido
    const mesa = await db.Mesa.create({ numero: 1, status: 'ocupada' });
    const pedido = await db.Pedido.create({
      mesaId: mesa.id,
      status: 'aberto',
      total: 100.00
    });
    
    // Faz a requisição para processar pagamento via PIX
    const res = await request(app)
      .post('/api/payments')
      .send({
        pedidoId: pedido.id,
        metodo: 'pix',
        valor: 100.00
      })
      .set('Accept', 'application/json');
    
    // Verifica a resposta
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('pedido');
    expect(res.body).to.have.property('pagamento');
    expect(res.body.pedido.status).to.equal('fechado');
    expect(res.body.pagamento.metodo).to.equal('pix');
    expect(res.body.pagamento.status).to.equal('pago');
  });
  
  it('Processa pagamento via Cartão de Crédito (POST /api/payments)', async function() {
    // Cria dados de teste: mesa e pedido
    const mesa = await db.Mesa.create({ numero: 2, status: 'ocupada' });
    const pedido = await db.Pedido.create({
      mesaId: mesa.id,
      status: 'aberto',
      total: 50.00
    });
    
    // Faz a requisição para processar pagamento via Cartão de Crédito
    const res = await request(app)
      .post('/api/payments')
      .send({
        pedidoId: pedido.id,
        metodo: 'cartao_credito',
        valor: 50.00
      })
      .set('Accept', 'application/json');
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('pedido');
    expect(res.body).to.have.property('pagamento');
    expect(res.body.pedido.status).to.equal('fechado');
    expect(res.body.pagamento.metodo).to.equal('cartao_credito');
    expect(res.body.pagamento.status).to.equal('pago');
  });
  
  it('Processa pagamento via Dinheiro (POST /api/payments)', async function() {
    // Cria dados de teste: mesa e pedido
    const mesa = await db.Mesa.create({ numero: 3, status: 'ocupada' });
    const pedido = await db.Pedido.create({
      mesaId: mesa.id,
      status: 'aberto',
      total: 75.00
    });
    
    // Faz a requisição para processar pagamento via Dinheiro
    const res = await request(app)
      .post('/api/payments')
      .send({
        pedidoId: pedido.id,
        metodo: 'dinheiro',
        valor: 75.00
      })
      .set('Accept', 'application/json');
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('pedido');
    expect(res.body).to.have.property('pagamento');
    expect(res.body.pedido.status).to.equal('fechado');
    expect(res.body.pagamento.metodo).to.equal('dinheiro');
    expect(res.body.pagamento.status).to.equal('pago');
  });
});
