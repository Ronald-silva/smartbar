import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';
import jwt from 'jsonwebtoken';

describe('Testes de Administração - SmartBar API', function() {
  let token;
  let pedidoTeste;
  let itemTeste;
  
  before(async function() {
    this.timeout(10000);
    
    try {
      // Gerar token JWT válido com isAdmin true
      token = jwt.sign(
        { isAdmin: true },
        process.env.JWT_SECRET || 'segredo123',
        { expiresIn: '1h' }
      );
      
      // Sincronizar banco de dados
      await db.sequelize.sync({ force: true });
      
      // Criar usuário admin
      const admin = await db.Usuario.create({
        username: 'admin',
        password: 'senha123',
        isAdmin: true
      });

      // Criar dados de teste
      const mesa = await db.Mesa.create({ 
        numero: 1, 
        status: 'livre' 
      });

      pedidoTeste = await db.Pedido.create({
        mesaId: mesa.id,
        status: 'aberto',
        total: 50.00
      });
      
      itemTeste = await db.Item.create({
        nome: 'Item Teste',
        descricao: 'Descrição teste',
        preco: 15.00,
        categoria: 'Bebidas',
        disponivel: true
      });
    } catch (error) {
      console.error('Erro na configuração dos testes:', error);
      throw error;
    }
  });

  describe('Autenticação', () => {
    it('deve rejeitar acesso sem token', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard');
      
      expect(res.status).to.equal(401);
    });

    it('deve permitir acesso com token válido', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
    });
  });

  describe('Dashboard', () => {
    it('deve retornar métricas do dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('pedidos');
      expect(res.body).to.have.property('mesas');
      expect(res.body).to.have.property('faturamento');
    });
  });

  describe('Gerenciamento de Pedidos', () => {
    it('deve listar pedidos com filtros', async () => {
      const res = await request(app)
        .get('/api/admin/orders')
        .query({ status: 'aberto' })
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('deve atualizar status do pedido', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${pedidoTeste.id}`)
        .send({ status: 'em_preparo' })
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('em_preparo');
    });

    it('deve cancelar um pedido', async () => {
      const res = await request(app)
        .delete(`/api/admin/orders/${pedidoTeste.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.pedido.status).to.equal('cancelado');
    });
  });

  describe('Gerenciamento do Cardápio', () => {
    it('deve listar itens do cardápio', async () => {
      const res = await request(app)
        .get('/api/admin/menu')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body.itens).to.be.an('array');
    });

    it('deve criar novo item', async () => {
      const novoItem = {
        nome: 'Novo Item',
        descricao: 'Descrição do novo item',
        preco: 25.00,
        categoria: 'Petiscos',
        disponivel: true
      };

      const res = await request(app)
        .post('/api/admin/menu')
        .send(novoItem)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(201);
      expect(res.body.item.nome).to.equal(novoItem.nome);
    });

    it('deve atualizar item existente', async () => {
      const atualizacao = {
        preco: 18.00,
        descricao: 'Descrição atualizada',
        disponivel: true
      };

      const res = await request(app)
        .put(`/api/admin/menu/${itemTeste.id}`)
        .send(atualizacao)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(200);
      expect(res.body.item.preco).to.equal(atualizacao.preco);
    });

    it('deve deletar item existente', async () => {
      const res = await request(app)
        .delete(`/api/admin/menu/${itemTeste.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
    });
  });

  after(async function() {
    this.timeout(10000);
    // Limpar dados de teste
    await db.Usuario.destroy({ where: {} });
    await db.Mesa.destroy({ where: {} });
    await db.Pedido.destroy({ where: {} });
    await db.Item.destroy({ where: {} });
  });
});
