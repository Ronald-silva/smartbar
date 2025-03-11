/**
 * Simula o processamento de um pagamento através de um gateway de pagamentos.
 * Esta é uma implementação sandbox que não realiza transações reais.
 * 
 * @param {Object} paymentData - Dados do pagamento a ser processado
 * @param {number} paymentData.pedidoId - ID do pedido associado ao pagamento
 * @param {string} paymentData.metodo - Método de pagamento (pix, cartao_credito, cartao_debito, dinheiro)
 * @param {number} paymentData.valor - Valor do pagamento
 * @param {Object} [options] - Opções adicionais
 * @param {boolean} [options.forceSuccess=false] - Se true, força o pagamento a ser bem-sucedido (útil para testes)
 * @returns {Promise<Object>} Objeto contendo o resultado do processamento
 * @property {string} status - Status do pagamento (pago, recusado, erro)
 * @property {string} transactionId - ID único da transação
 * @property {Object} paymentData - Dados originais do pagamento
 * @throws {Error} Se os dados do pagamento forem inválidos
 */
export async function processPayment(paymentData, options = {}) {
    // Validação básica dos dados
    if (!paymentData || !paymentData.pedidoId || !paymentData.metodo || !paymentData.valor) {
        throw new Error('Dados de pagamento incompletos ou inválidos');
    }

    // Lista de métodos de pagamento permitidos
    const metodosPermitidos = ['pix', 'cartao_credito', 'cartao_debito', 'dinheiro'];
    if (!metodosPermitidos.includes(paymentData.metodo.toLowerCase())) {
        throw new Error(`Método de pagamento '${paymentData.metodo}' não suportado`);
    }

    // Simula o atraso no processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Gera um ID de transação único
    // Combina timestamp com um número aleatório e formata como hexadecimal
    const transactionId = `${Date.now()}${Math.floor(Math.random() * 1000000)}`.toString(16).toUpperCase();

    // Simula uma taxa de sucesso de 95% para pagamentos
    // Se forceSuccess for true, sempre retorna sucesso
    const success = options.forceSuccess || Math.random() < 0.95;

    if (!success) {
        return {
            status: 'recusado',
            transactionId,
            paymentData,
            error: 'Pagamento recusado pela operadora (simulação)'
        };
    }

    // Simula diferentes comportamentos baseado no método de pagamento
    let processamento;
    switch (paymentData.metodo.toLowerCase()) {
        case 'pix':
            processamento = {
                status: 'pago',
                pixCode: `PIX${transactionId}`,
                instantPayment: true
            };
            break;
        case 'cartao_credito':
            processamento = {
                status: 'pago',
                authorizationCode: `AUTH${Math.random().toString(36).substring(7).toUpperCase()}`,
                installments: 1
            };
            break;
        case 'cartao_debito':
            processamento = {
                status: 'pago',
                authorizationCode: `AUTH${Math.random().toString(36).substring(7).toUpperCase()}`,
                debitCard: true
            };
            break;
        case 'dinheiro':
            processamento = {
                status: 'pago',
                cashPayment: true
            };
            break;
    }

    // Retorna o resultado do processamento
    return {
        status: processamento.status,
        transactionId,
        paymentData,
        processamento
    };
} 