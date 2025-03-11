import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/models/index.js';
import jwt from 'jsonwebtoken';

describe('Testes de Pagamento - SmartBar API', () => {
    let pedidoTeste;

    before(async function() {
        this.timeout(10000);
        // Criar mesa e pedido para teste
        const mesa = await db.Mesa.create({ 
            numero: 1, 
            status: 'ocupada' 
        });
        
        pedidoTeste = await db.Pedido.create({
            mesaId: mesa.id,
            status: 'aberto',
            total: 100.00
        });
    });

    it('Processa pagamento via PIX', async () => {
        const response = await request(app)
            .post('/api/payments')
            .send({ 
                pedidoId: pedidoTeste.id,
                metodo: 'pix',
                valor: 100.00
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('pagamento');
        expect(response.body.pagamento.status).to.equal('pago');
    });

    it('Processa pagamento via Cartão de Crédito', async () => {
        const response = await request(app)
            .post('/api/payments')
            .send({ 
                pedidoId: pedidoTeste.id,
                metodo: 'cartao_credito',
                valor: 100.00
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('pagamento');
        expect(response.body.pagamento.status).to.equal('pago');
    });

    it('Processa pagamento via Dinheiro', async () => {
        const response = await request(app)
            .post('/api/payments')
            .send({ 
                pedidoId: pedidoTeste.id,
                metodo: 'dinheiro',
                valor: 100.00
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('pagamento');
        expect(response.body.pagamento.status).to.equal('pago');
    });

    after(async function() {
        this.timeout(10000);
        // Limpar dados de teste
        await db.Pedido.destroy({ where: {} });
        await db.Mesa.destroy({ where: {} });
        await db.Pagamento.destroy({ where: {} });
    });
});

describe('Testes de Administração - SmartBar API', () => {
    let token;
    let pedidoTeste;
    
    before(async function() {
        this.timeout(10000);
        
        // Criar usuário admin para testes
        const admin = await db.Usuario.create({
            username: 'admin_test',
            password: 'senha123',
            isAdmin: true
        });

        // Gerar token JWT válido
        token = jwt.sign(
            { id: admin.id, isAdmin: true },
            process.env.JWT_SECRET || 'segredo123',
            { expiresIn: '1h' }
        );

        // Criar mesa e pedido para teste
        const mesa = await db.Mesa.create({ 
            numero: 1, 
            status: 'ocupada' 
        });
        
        pedidoTeste = await db.Pedido.create({
            mesaId: mesa.id,
            status: 'aberto',
            total: 100.00
        });
    });

    it('deve permitir acesso com token válido', async () => {
        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
    });

    it('deve retornar métricas do dashboard', async () => {
        const response = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
    });

    it('deve listar pedidos com filtros', async () => {
        const response = await request(app)
            .get('/api/admin/orders')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
    });

    it('deve atualizar status do pedido', async () => {
        const response = await request(app)
            .put(`/api/admin/orders/${pedidoTeste.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'COMPLETED' });
        expect(response.status).to.equal(200);
    });

    it('deve cancelar um pedido', async () => {
        const response = await request(app)
            .delete(`/api/admin/orders/${pedidoTeste.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
    });

    it('deve listar itens do cardápio', async () => {
        const response = await request(app)
            .get('/api/admin/menu')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
    });

    it('deve criar novo item', async () => {
        const response = await request(app)
            .post('/api/admin/menu')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Novo Item', 
                preco: 10,
                categoria: 'Bebidas',
                descricao: 'Descrição do novo item'
            });
        expect(response.status).to.equal(201);
    });

    it('deve atualizar item existente', async () => {
        const response = await request(app)
            .put('/api/admin/menu/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                nome: 'Item Atualizado', 
                preco: 15,
                disponivel: true
            });
        expect(response.status).to.equal(200);
    });

    it('deve deletar item existente', async () => {
        const response = await request(app)
            .delete('/api/admin/menu/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
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