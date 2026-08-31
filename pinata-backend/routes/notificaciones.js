const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');

// Obtener todas las notificaciones globales
router.get('/', async (req, res) => {
  try {
    const notificaciones = await Notificacion.find().sort({ fecha: -1 });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva notificación (solo admin, pero sin auth por ahora)
router.post('/', async (req, res) => {
  try {
    const { titulo, mensaje } = req.body;
    if (!titulo || !mensaje) return res.status(400).json({ error: 'Faltan campos requeridos' });
    const notificacion = new Notificacion({ titulo, mensaje });
    await notificacion.save();
    res.status(201).json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 