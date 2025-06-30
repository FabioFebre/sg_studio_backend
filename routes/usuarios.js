const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const enviarCorreoBienvenida = async (emailDestino, nombre) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_SG,
      pass: process.env.PASS_CORREO_SG,
    },
  });

  const mailOptions = {
    from: 'SG Studio <' + process.env.CORREO_SG + '>',
    to: emailDestino,
    subject: '¡Gracias por registrarte en SG Studio!',
    text: `Hola ${nombre},\n\nGracias por registrarte en la Página Oficial de SG Studio.\n\nEsperamos con ansias tus pedidos vía WhatsApp.\n\n¡Saludos!\nEl equipo de SG Studio 🎨`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoBienvenida };
// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    console.log('Usuarios encontrados:', usuarios);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password, ...usuarioSinPassword } = usuario.toJSON();
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});
// Crear un nuevo usuario (registro)
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const usuarioExistente = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Ya existe un usuario con este correo' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email: emailNormalizado,
      password: hashedPassword,
      rol: rol || 'user',
    });

    // Enviar correo de bienvenida
    await enviarCorreoBienvenida(emailNormalizado, nombre);

    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});

// Iniciar sesión (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailNormalizado = email.toLowerCase().trim();
    console.log('Email recibido:', emailNormalizado);

    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });

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

    // Eliminar la contraseña del objeto usuario
    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();

    res.json({ usuario: usuarioSinPassword });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// 🔧 Editar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const datosActualizados = {
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      rol: rol || usuario.rol
    };

    if (password) {
      datosActualizados.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(datosActualizados);

    const { password: pw, ...usuarioSinPassword } = usuario.toJSON();
    res.json({ mensaje: 'Usuario actualizado', usuario: usuarioSinPassword });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});
// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


module.exports = router;
