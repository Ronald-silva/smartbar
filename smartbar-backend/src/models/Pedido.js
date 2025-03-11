// models/Pedido.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pedido extends Model {
    static associate(models) {
      Pedido.belongsTo(models.Mesa, {
        foreignKey: 'mesaId',
        as: 'mesa'
      });
      Pedido.hasMany(models.PedidoItem, {
        foreignKey: 'pedidoId',
        as: 'itens'
      });
      Pedido.hasOne(models.Pagamento, {
        foreignKey: 'pedidoId',
        as: 'pagamento'
      });
    }
  }

  Pedido.init({
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
    }
  }, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos'
  });

  return Pedido;
};
