const express = require('express');
const router = express.Router();
const { Orden, OrdenItem, Usuario } = require('../models');

// Obtener todas las órdenes
router.get('/', async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: OrdenItem,
          as: 'items'
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// Obtener una orden específica
router.get('/:id', async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id, {
      include: [
        {
          model: OrdenItem,
          as: 'items'
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email']
        }
      ]
    });

    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});
// Crear una nueva orden
router.post('/', async (req, res) => {
  try {
    const {
      usuarioId, nombre, apellido, email, telefono,
      pais, departamento, provincia, distrito,
      direccion, referencia, metodoEnvio,
      subtotal, envio, total, cuponCodigo,
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe contener al menos un producto' });
    }

    const orden = await Orden.create({
      usuarioId,
      nombre,
      apellido,
      email,
      telefono,
      pais,
      departamento,
      provincia,
      distrito,
      direccion,
      referencia,
      metodoEnvio,
      subtotal,
      envio,
      total,
      cuponCodigo
    });

    // Guardar los productos relacionados
    const itemsCreados = await Promise.all(
      items.map(async (item) => {
        return await OrdenItem.create({
          ordenId: orden.id,
          productoId: item.productoId,
          nombreProducto: item.nombreProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          talla: item.talla,
          precioTotal: item.precioUnitario * item.cantidad
        });
      })
    );

    res.status(201).json({
      mensaje: 'Orden creada correctamente',
      ordenId: orden.id,
      items: itemsCreados
    });

  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});


// Actualizar estado de una orden
router.put('/estado/:id', async (req, res) => {
  try {
    const { estado } = req.body;

    const orden = await Orden.findByPk(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

    orden.estado = estado;
    await orden.save();

    res.json({ mensaje: 'Estado actualizado', orden });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

// Eliminar una orden
router.delete('/:id', async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

    await OrdenItem.destroy({ where: { ordenId: orden.id } });
    await orden.destroy();

    res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});

module.exports = router;
