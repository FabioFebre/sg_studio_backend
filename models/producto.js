'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria'
      });
    }
  }

  Producto.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    imagen: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('imagen');
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue('imagen', JSON.stringify(value));
      }
    },
    categoriaId: DataTypes.INTEGER,

    // Campos adicionales
    color: DataTypes.STRING,          // Ejemplo: "Rojo", "Azul"
    talla: DataTypes.STRING,          // Ejemplo: "S", "M", "L", "XL"
    cantidad: DataTypes.INTEGER,      // Stock disponible por combinación
    composicion: DataTypes.STRING,    // Ejemplo: "100% algodón"
    info: DataTypes.TEXT,             // Información adicional
    cuidados: DataTypes.TEXT          // Instrucciones de lavado, etc.
  }, {
    sequelize,
    modelName: 'Producto',
  });

  return Producto;
};
