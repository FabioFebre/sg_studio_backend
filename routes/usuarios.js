//routes/usuarios.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM public.usuarios');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/login', (req, res) => {
  res.send('Login (GET): esta ruta sirve solo para pruebas o formularios HTML');
});


// POST: agregar nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  try {
    const resultado = await db.query(
      'INSERT INTO public.usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, email, password]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const resultado = await db.query(
      'SELECT * FROM public.usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (resultado.rows.length > 0) {
      res.json({ mensaje: 'Login exitoso', usuario: resultado.rows[0] });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
