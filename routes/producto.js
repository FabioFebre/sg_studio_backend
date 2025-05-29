const express = require('express');
const router = express.Router();
const { Producto, Categoria } = require('../models');
const multer = require('multer');
const path = require('path');
const upload = require('../middlewares/upload');

// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoriaId,
      color,
      talla,
      cantidad,
      composicion,
      info,
      cuidados
    } = req.body;

    const imagen = req.file ? req.file.path : null;

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen,
      categoriaId,
      color,
      talla,
      cantidad,
      composicion,
      info,
      cuidados
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

//Editar Producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const {
      nombre,
      descripcion,
      precio,
      categoriaId,
      color,
      talla,
      cantidad,
      composicion,
      info,
      cuidados
    } = req.body;

    let nuevaImagen = producto.imagen;

    if (req.file) {
      // (Opcional) Eliminar imagen anterior de Cloudinary si existe
      if (producto.imagen) {
        const publicId = producto.imagen.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`productos/${publicId}`);
      }

      // Guardar nueva imagen
      nuevaImagen = req.file.path;
    }

    await producto.update({
      nombre,
      descripcion,
      precio,
      imagen: nuevaImagen,
      categoriaId,
      color,
      talla,
      cantidad,
      composicion,
      info,
      cuidados
    });

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


//Eliminar Producto 
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // No eliminamos la imagen en Cloudinary, porque la imagen siempre estará
    // if (producto.imagen) {
    //   const publicId = producto.imagen.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(`productos/${publicId}`);
    // }

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


module.exports = router;
