require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/producto');
const categoriasRouter = require('./routes/categoria');
const carritoRouter = require('./routes/carrito');
const ordenesRouter = require('./routes/orden');
const ordenItemsRouter = require('./routes/ordenItem');
const reclamosRouter = require('./routes/reclamo');

// Se usan paths relativos, **NO URLs externas**
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/ordenes', ordenesRouter);
app.use('/api/orden-items', ordenItemsRouter);
app.use('/api/reclamos', reclamosRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API SG Studio Backend está corriendo 🚀');
});

// Puerto
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
