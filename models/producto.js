'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.FLOAT,   
    imagen: DataTypes.STRING,
    categoriaId: DataTypes.INTEGER, // Agrega esta línea para que Sequelize sepa que existe esta columna
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};
