// models/Item.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.PedidoItem, {
        foreignKey: 'itemId',
        as: 'pedidoItens'
      });
    }
  }

  Item.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
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
      type: DataTypes.STRING,
      defaultValue: '/images/placeholder.jpg'
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'itens'
  });

  return Item;
};
