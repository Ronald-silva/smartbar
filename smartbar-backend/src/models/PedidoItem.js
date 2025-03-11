// models/PedidoItem.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PedidoItem extends Model {
    static associate(models) {
      PedidoItem.belongsTo(models.Pedido, {
        foreignKey: 'pedidoId',
        as: 'pedido'
      });
      PedidoItem.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item'
      });
    }
  }

  PedidoItem.init({
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
    }
  }, {
    sequelize,
    modelName: 'PedidoItem',
    tableName: 'pedido_itens'
  });

  return PedidoItem;
};
