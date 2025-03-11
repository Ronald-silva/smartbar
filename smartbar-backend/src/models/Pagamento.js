// models/Pagamento.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pagamento extends Model {
    static associate(models) {
      Pagamento.belongsTo(models.Pedido, {
        foreignKey: 'pedidoId',
        as: 'pedido'
      });
    }
  }

  Pagamento.init({
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
      type: DataTypes.STRING,
      defaultValue: 'pendente'
    }
  }, {
    sequelize,
    modelName: 'Pagamento',
    tableName: 'pagamentos'
  });

  return Pagamento;
};
