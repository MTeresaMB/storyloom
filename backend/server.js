const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const charactersRoutes = require('./routes/characters');
const locationsRoutes = require('./routes/locations');
const objectsRoutes = require('./routes/objects');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'StoryLoom API funcionando! ��',
    version: '1.0.0',
    endpoints: ['/api/characters', '/api/locations', '/api/objects']
  });
});

app.use('/api/characters', charactersRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/objects', objectsRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`�� Servidor corriendo en http://localhost:${PORT}`);
});