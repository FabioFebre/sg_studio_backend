const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    console.log('Usuarios encontrados:', usuarios); // 👈 esto
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Crear un nuevo usuario
// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol || 'usuario', // por defecto usuario
    });

    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /usuarios/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Email recibido:', email);
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.log('No se encontró el usuario');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('Usuario encontrado:', usuario.email);

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    console.log('¿Password válida?', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();
    res.json({ usuario: usuarioSinPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


module.exports = router;
