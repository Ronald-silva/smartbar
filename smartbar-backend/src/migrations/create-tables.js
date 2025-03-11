const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

async function createTables() {
  try {
    // Criar tabela de mesas
    await sequelize.getQueryInterface().createTable('mesas', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      status: {
        type: DataTypes.ENUM('disponivel', 'ocupada'),
        defaultValue: 'disponivel'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Criar tabela de itens
    await sequelize.getQueryInterface().createTable('itens', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imagem: {
        type: DataTypes.STRING
      },
      disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Criar tabela de pedidos
    await sequelize.getQueryInterface().createTable('pedidos', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mesaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'mesas',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('aberto', 'preparando', 'pronto', 'entregue', 'cancelado'),
        defaultValue: 'aberto'
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Criar tabela de pedido_itens
    await sequelize.getQueryInterface().createTable('pedido_itens', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pedidos',
          key: 'id'
        }
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'itens',
          key: 'id'
        }
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Criar tabela de pagamentos
    await sequelize.getQueryInterface().createTable('pagamentos', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pedidos',
          key: 'id'
        }
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      metodo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pendente', 'aprovado', 'recusado'),
        defaultValue: 'pendente'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    console.log('Tabelas criadas com sucesso!');
    
    // Inserir algumas mesas para teste
    await sequelize.getQueryInterface().bulkInsert('mesas', [
      { numero: 1, status: 'disponivel', createdAt: new Date(), updatedAt: new Date() },
      { numero: 2, status: 'disponivel', createdAt: new Date(), updatedAt: new Date() },
      { numero: 3, status: 'disponivel', createdAt: new Date(), updatedAt: new Date() },
      { numero: 4, status: 'disponivel', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Inserir alguns itens para teste
    await sequelize.getQueryInterface().bulkInsert('itens', [
      { 
        nome: 'Hambúrguer Clássico', 
        descricao: 'Pão, hambúrguer, queijo, alface e tomate',
        preco: 25.90,
        categoria: 'comida',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        nome: 'Refrigerante', 
        descricao: 'Lata 350ml',
        preco: 5.90,
        categoria: 'bebida',
        disponivel: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Dados iniciais inseridos com sucesso!');

  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  } finally {
    await sequelize.close();
  }
}

createTables(); 