import { expect } from 'chai';
import { processPayment } from '../src/services/paymentGateway.js';

describe('Payment Gateway Service', () => {
    const paymentData = {
        pedidoId: 1,
        metodo: 'pix',
        valor: 100.00
    };

    const testOptions = { forceSuccess: true };

    it('deve processar um pagamento PIX com sucesso', async () => {
        const result = await processPayment(paymentData, testOptions);
        
        expect(result).to.have.property('status', 'pago');
        expect(result).to.have.property('transactionId').that.is.a('string');
        expect(result).to.have.property('processamento');
        expect(result.processamento).to.have.property('pixCode');
        expect(result.processamento).to.have.property('instantPayment', true);
        expect(result.paymentData).to.deep.equal(paymentData);
    });

    it('deve processar um pagamento com cartão de crédito', async () => {
        const creditCardPayment = {
            ...paymentData,
            metodo: 'cartao_credito'
        };

        const result = await processPayment(creditCardPayment, testOptions);
        
        expect(result).to.have.property('status', 'pago');
        expect(result).to.have.property('transactionId').that.is.a('string');
        expect(result).to.have.property('processamento');
        expect(result.processamento).to.have.property('authorizationCode');
        expect(result.processamento).to.have.property('installments', 1);
        expect(result.paymentData).to.deep.equal(creditCardPayment);
    });

    it('deve processar um pagamento em dinheiro', async () => {
        const cashPayment = {
            ...paymentData,
            metodo: 'dinheiro'
        };

        const result = await processPayment(cashPayment, testOptions);
        
        expect(result).to.have.property('status', 'pago');
        expect(result).to.have.property('transactionId').that.is.a('string');
        expect(result).to.have.property('processamento');
        expect(result.processamento).to.have.property('cashPayment', true);
        expect(result.paymentData).to.deep.equal(cashPayment);
    });

    it('deve rejeitar pagamento com método inválido', async () => {
        const invalidPayment = {
            ...paymentData,
            metodo: 'método_invalido'
        };

        try {
            await processPayment(invalidPayment, testOptions);
            throw new Error('Deveria ter lançado um erro');
        } catch (error) {
            expect(error.message).to.include('não suportado');
        }
    });

    it('deve rejeitar pagamento com dados incompletos', async () => {
        const incompletePayment = {
            pedidoId: 1
            // metodo e valor faltando
        };

        try {
            await processPayment(incompletePayment, testOptions);
            throw new Error('Deveria ter lançado um erro');
        } catch (error) {
            expect(error.message).to.include('incompletos ou inválidos');
        }
    });

    it('deve simular o atraso no processamento', async () => {
        const startTime = Date.now();
        await processPayment(paymentData, testOptions);
        const endTime = Date.now();
        
        expect(endTime - startTime).to.be.at.least(500);
    });

    it('deve simular falha no pagamento quando forceSuccess é false', async () => {
        // Força várias tentativas até obter uma falha
        let result;
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            result = await processPayment(paymentData);
            if (result.status === 'recusado') {
                break;
            }
            attempts++;
        }

        expect(result).to.have.property('status', 'recusado');
        expect(result).to.have.property('error').that.includes('recusado');
    });
}); 