require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const mongoose = require('mongoose');
const notificacionesRouter = require('./routes/notificaciones');
const Notificacion = require('./models/Notificacion');
const { requireAdmin, optionalAdmin } = require('./middleware/auth');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configurar multer para múltiples archivos
const uploadMultiple = multer({ storage: multer.memoryStorage() }).array('files', 10); // máximo 10 archivos

app.use(cors());

mongoose.connect('mongodb+srv://gerardogerrypedrizco:mDA7jqDlZ1QYAplE@criptounam.hwmpkpu.mongodb.net/?retryWrites=true&w=majority&appName=CriptoUNAM', { useNewUrlParser: true, useUnifiedTopology: true })  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const Evento = require('./models/Eventos');
const Curso = require('./models/Curso');
const Newsletter = require('./models/newsletter');

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
      }
    });

    res.json({ ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}` });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Endpoint para subir múltiples archivos
app.post('/upload-multiple', (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error al subir archivos' });
    }

    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No se subieron archivos' });
      }

      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          maxBodyLength: Infinity,
          headers: {
            ...formData.getHeaders(),
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_API_SECRET
          }
        });

        uploadedUrls.push(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
      }

      res.json({ urls: uploadedUrls });
    } catch (error) {
      console.error('Error al subir archivos:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// Endpoint para guardar un evento (solo admin)
app.post('/evento', requireAdmin, express.json(), async (req, res) => {
  try {
    const { tipo, titulo, fecha, hora, lugar, cupo, descripcion, imagen, imagenPrincipal, fotos, videos, presentaciones, registroLink } = req.body;
    
    // Validar campos requeridos según el tipo de evento
    if (!tipo || !['proximo', 'anterior'].includes(tipo)) {
      return res.status(400).json({ error: 'El tipo de evento debe ser "proximo" o "anterior"' });
    }
    
    if (!titulo || !fecha || !hora || !lugar || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos: titulo, fecha, hora, lugar, descripcion' });
    }

    // Validar imagen según el tipo de evento
    if (tipo === 'proximo' && !imagen) {
      return res.status(400).json({ error: 'Los eventos próximos requieren una imagen' });
    }
    if (tipo === 'anterior' && !imagenPrincipal) {
      return res.status(400).json({ error: 'Los eventos anteriores requieren una imagenPrincipal' });
    }

    // Validar que las URLs sean válidas
    const validateUrls = (urls) => {
      if (!urls) return [];
      if (!Array.isArray(urls)) return [urls];
      return urls.filter(url => {
        // Aceptar URLs de IPFS
        if (url.startsWith('https://gateway.pinata.cloud/ipfs/')) return true;
        // Aceptar URLs de YouTube
        if (url.includes('youtube.com/') || url.includes('youtu.be/')) return true;
        return false;
      });
    };

    const evento = new Evento({
      tipo,
      titulo,
      fecha,
      hora,
      lugar,
      cupo,
      descripcion,
      imagen: tipo === 'proximo' ? imagen : undefined,
      imagenPrincipal: tipo === 'anterior' ? imagenPrincipal : undefined,
      fotos: validateUrls(fotos),
      videos: validateUrls(videos),
      presentaciones: validateUrls(presentaciones),
      registroLink
    });

    await evento.save();
    // Crear notificación global
    if (tipo === 'proximo') {
      await Notificacion.create({
        titulo: 'Nuevo evento próximo',
        mensaje: `¡No te pierdas el evento: ${titulo}!`
      });
    } else if (tipo === 'anterior') {
      await Notificacion.create({
        titulo: 'Nuevo evento anterior',
        mensaje: `Ya puedes ver el resumen del evento: ${titulo}`
      });
    }
    res.json(evento);
  } catch (error) {
    console.error('Error al guardar evento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todos los eventos
app.get('/eventos', async (req, res) => {
  const eventos = await Evento.find().sort({ creadoEn: -1 });
  res.json(eventos);
});

// Endpoint para borrar un evento por ID
app.delete('/evento/:id', requireAdmin, async (req, res) => {
  try {
    console.log('Intentando eliminar evento con ID:', req.params.id);
    const deleted = await Evento.findByIdAndDelete(req.params.id);
    console.log('Resultado de findByIdAndDelete:', deleted);
    if (!deleted) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para editar un evento por ID
app.put('/evento/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await Evento.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para guardar un curso (solo admin)
app.post('/curso', requireAdmin, express.json(), async (req, res) => {
  try {
    const {
      titulo,
      nivel,
      duracion,
      imagen,
      descripcion,
      instructor,
      precio,
      categorias,
      requisitos,
      lecciones
    } = req.body;

    // Validar campos requeridos
    if (!titulo || !nivel || !duracion || !imagen || !descripcion || !instructor) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: titulo, nivel, duracion, imagen, descripcion, instructor'
      });
    }

    // Validar nivel
    if (!['Principiante', 'Intermedio', 'Avanzado'].includes(nivel)) {
      return res.status(400).json({
        error: 'El nivel debe ser: Principiante, Intermedio o Avanzado'
      });
    }

    // Validar lecciones
    if (!Array.isArray(lecciones) || lecciones.length === 0) {
      return res.status(400).json({
        error: 'El curso debe tener al menos una lección'
      });
    }

    // Validar cada lección
    for (const leccion of lecciones) {
      if (!leccion.titulo || !leccion.video || !leccion.descripcion) {
        return res.status(400).json({
          error: 'Cada lección debe tener: titulo, video y descripcion'
        });
      }
    }

    const curso = new Curso({
      titulo,
      nivel,
      duracion,
      imagen,
      descripcion,
      instructor,
      precio: precio || 0,
      categorias: categorias || [],
      requisitos,
      lecciones
    });

    await curso.save();
    // Crear notificación global
    await Notificacion.create({
      titulo: 'Nuevo curso disponible',
      mensaje: `¡Ya puedes inscribirte al curso: ${titulo}!`
    });
    res.json(curso);
  } catch (error) {
    console.error('Error al guardar curso:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todos los cursos
app.get('/cursos', async (req, res) => {
  const cursos = await Curso.find().sort({ creadoEn: -1 });
  res.json(cursos);
});

// Endpoint para obtener un curso por ID
app.get('/curso/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para borrar un curso por ID
app.delete('/curso/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Curso.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener todas las entradas de newsletter
app.get('/newsletter', async (req, res) => {
  try {
    const entries = await Newsletter.find().sort({ creadoEn: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para crear una nueva entrada de newsletter
app.post('/newsletter', requireAdmin, express.json(), async (req, res) => {
  try {
    const { title, date, content, imageUrl, author, tags } = req.body;
    const entry = new Newsletter({ title, date, content, imageUrl, author, tags });
    await entry.save();
    // Crear notificación global
    await Notificacion.create({
      titulo: 'Nueva newsletter',
      mensaje: `Lee la nueva newsletter: ${title}`
    });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para borrar una entrada de newsletter por ID
app.delete('/newsletter/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Newsletter.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Newsletter no encontrada' });
    }
    res.json({ message: 'Newsletter eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/notificaciones', notificacionesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));