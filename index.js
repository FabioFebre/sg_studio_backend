// index.js
const express = require('express');
const app = express();


const cors = require('cors');

app.use(cors({
  origin: ['https://www.sgstudio.shop', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));


app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const db = require('./models');

require('dotenv').config();
console.log('Base de datos actual:', db.sequelize.config.database);
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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

//carrito
const carritoRoutes = require('./routes/carrito');
app.use('/carrito', carritoRoutes);


//carritoItem
const carritoItemRoutes = require('./routes/carritoitem');
app.use('/carritoIitem', carritoItemRoutes);


//orden
const ordenRoutes = require('./routes/orden');
app.use('/ordenes', ordenRoutes);

//ordenItem
const ordenItemRoutes = require('./routes/ordenItem');
app.use('/orden-items', ordenItemRoutes);

//reclamo
const reclamosRoutes = require('./routes/reclamo');
app.use('/reclamos', reclamosRoutes);


app.listen(3005, () => {
  console.log('Servidor corriendo en http://localhost:3005');
});
