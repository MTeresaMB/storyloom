const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const charactersRoutes = require('./routes/characters');
const locationsRoutes = require('./routes/locations');
const objectsRoutes = require('./routes/objects');
const chaptersRoutes = require('./routes/chapters');

app.get('/', (req, res) => {
  res.json({
    message: 'StoryLoom API funcionando! ��',
    version: '1.0.0',
    endpoints: [
      '/api/characters',
      '/api/locations',
      '/api/objects',
      '/api/chapters',
    ],
  });
});

app.set('etag', false);
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api/characters', charactersRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/objects', objectsRoutes);
app.use('/api/chapters', chaptersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`�� Servidor corriendo en http://localhost:${PORT}`);
});
