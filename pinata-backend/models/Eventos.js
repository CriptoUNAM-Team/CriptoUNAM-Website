// pinata-backend/models/Evento.js
const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['proximo', 'anterior'], required: true },
  titulo: String,
  fecha: String,
  hora: String,
  lugar: String,
  cupo: Number,
  descripcion: String,
  imagen: String, // para próximos eventos
  imagenPrincipal: String, // para eventos anteriores
  fotos: [String],
  videos: [String],
  presentaciones: [String],
  registroLink: String,
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evento', EventoSchema);