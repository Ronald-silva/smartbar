// routes/authRoutes.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuário
    const user = await db.Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha
    const senhaValida = await user.checkPassword(password);
    if (!senhaValida) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Senha incorreta'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Retornar resposta
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao processar login'
    });
  }
});

// Verificar token/sessão atual
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.Usuario.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    res.status(401).json({
      error: 'Não autorizado',
      message: 'Token inválido ou expirado'
    });
  }
});

export default router;
