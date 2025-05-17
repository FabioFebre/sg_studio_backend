//routes/producto.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM public.productos ORDER BY id');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query('SELECT * FROM public.productos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Crear un nuevo producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, precio, stock, talla, color, categoria, imagen_url } = req.body;
  try {
    const resultado = await db.query(
      `INSERT INTO public.productos 
       (nombre, descripcion, precio, stock, talla, color, categoria, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [nombre, descripcion, precio, stock, talla, color, categoria, imagen_url]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Actualizar un producto existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, talla, color, categoria, imagen_url } = req.body;
  try {
    const resultado = await db.query(
      `UPDATE public.productos 
       SET nombre = $1, descripcion = $2, precio = $3, stock = $4, talla = $5, color = $6, 
           categoria = $7, imagen_url = $8 
       WHERE id = $9 RETURNING *`,
      [nombre, descripcion, precio, stock, talla, color, categoria, imagen_url, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query('DELETE FROM public.productos WHERE id = $1 RETURNING *', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado', producto: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
