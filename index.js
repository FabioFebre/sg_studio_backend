// index.js
const express = require('express');
const app = express();
app.use(express.json());
const db = require('./models');
const cors = require('cors');
app.use(cors());
require('dotenv').config();


db.sequelize.sync() 
  .then(() => {
    console.log('Conectado a la base de datos y sincronizado');
  })
  .catch((err) => {
    console.error('Error al conectar la base de datos:', err);
  });

//usuarios
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);

//productos
const productosRouter = require('./routes/producto');
app.use('/productos', productosRouter);


//categorias
const categoriasRouter = require('./routes/categoria');
app.use('/categorias', categoriasRouter);



app.listen(3005, () => {
  console.log('Servidor corriendo en http://localhost:3005');
});
