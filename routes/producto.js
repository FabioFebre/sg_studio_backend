const express = require('express');
const router = express.Router();
const { Producto, Categoria } = require('../models');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


// Configura Cloudinary
cloudinary.config({
  cloud_name: 'Root',
  api_key: '449239287681465',
  api_secret: 'pbQlbSv9WitFR31fsfh6ZdICSg0'
});


// Almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos', // Puedes cambiar el nombre del folder
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage });




// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoriaId } = req.body;

    // URL pública de Cloudinary
    const imagen = req.file ? req.file.path : null;

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen, // Guarda la URL pública, no el nombre del archivo
      categoriaId
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
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
