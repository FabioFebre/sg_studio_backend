const express = require('express');
const router = express.Router();
const { Producto, Categoria } = require('../models');

// Crear producto
router.post('/', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar productos con su categoría
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: { model: Categoria, as: 'categoria' }
    });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: { model: Categoria, as: 'categoria' }
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
