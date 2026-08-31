const mongoose = require('mongoose');

const LeccionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  video: { type: String, required: true },
  descripcion: { type: String, required: true }
});

const CursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  nivel: { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado'], required: true },
  duracion: { type: String, required: true },
  imagen: { type: String, required: true },
  descripcion: { type: String, required: true },
  instructor: { type: String, required: true },
  precio: { type: Number, default: 0 },
  estudiantes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  categorias: [String],
  requisitos: { type: String },
  lecciones: [LeccionSchema],
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Curso', CursoSchema); 