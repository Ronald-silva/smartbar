// controllers/authController.js
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const usuario = await db.Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const senhaValida = await usuario.checkPassword(password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: usuario.id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export default { login };
