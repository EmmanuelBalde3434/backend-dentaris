// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tratamientoRoutes = require('./routes/tratamientoRoutes');
const insumoRoutes = require('./routes/insumoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tratamientos', tratamientoRoutes);
app.use('/api/insumos', insumoRoutes);

app.get('/', (req, res) => {
  res.send('Catalog Service - Tratamientos OK');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Catalog service corriendo en http://localhost:${PORT}`);
});
