const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leidaPor: { type: [String], default: [] } // direcciones de wallet que ya la leyeron (opcional)
});

module.exports = mongoose.model('Notificacion', NotificacionSchema); 