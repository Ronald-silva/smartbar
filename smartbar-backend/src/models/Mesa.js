// models/Mesa.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Mesa extends Model {
    static associate(models) {
      // Definir associações aqui se necessário
      Mesa.hasMany(models.Pedido, {
        foreignKey: 'mesaId',
        as: 'pedidos'
      });
    }
  }

  Mesa.init({
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('disponivel', 'ocupada'),
      allowNull: false,
      defaultValue: 'disponivel'
    }
  }, {
    sequelize,
    modelName: 'Mesa',
    tableName: 'mesas'
  });

  return Mesa;
}
