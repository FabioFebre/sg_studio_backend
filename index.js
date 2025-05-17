// index.js
const express = require('express');
const app = express();
app.use(express.json());


//usuarios
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);

//productos
const productosRouter = require('./routes/producto');
app.use('/productos', productosRouter);



const cors = require('cors');
app.use(cors());


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
