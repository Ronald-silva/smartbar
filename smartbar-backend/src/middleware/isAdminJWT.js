// middlewares/isAdminJWT.js
import jwt from 'jsonwebtoken';

export function isAdminJWT(req, res, next) {
  try {
    // Espera que o token seja enviado no header Authorization como Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        details: 'O header Authorization é obrigatório'
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Token inválido',
        details: 'O formato deve ser: Bearer TOKEN' 
      });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        details: 'O prefixo Bearer é obrigatório' 
      });
    }

    // Verifica o token de forma síncrona para melhor tratamento de erros
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo123');
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        details: 'Esta rota requer privilégios de administrador' 
      });
    }

    // Adiciona os dados do usuário à requisição
    req.user = decoded;
    return next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ 
      error: 'Token inválido',
      details: error.message 
    });
  }
}
