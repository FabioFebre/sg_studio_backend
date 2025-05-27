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
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Compara la contraseña ingresada con la encriptada
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
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

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});


// Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre, apellido, email, password, rol } = req.body;

    // Si viene una nueva contraseña, la encriptamos
    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    // Actualizar otros campos si existen
    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;

    await usuario.save();

    const { password: _, ...usuarioSinPassword } = usuario.toJSON();

    res.json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

module.exports = router;
