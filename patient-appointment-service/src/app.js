// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const historialRoutes = require('./routes/historialRoutes');
const odontogramaRoutes = require('./routes/odontogramaRoutes');
const dienteRoutes = require('./routes/dienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const planTratamientoRoutes = require('./routes/planTratamientoRoutes');
const planDetalleRoutes = require('./routes/planDetalleRoutes');
const fotoRoutes = require('./routes/fotoProcedimientoRoutes');
const prescripcionRoutes = require('./routes/prescripcionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/historiales', historialRoutes);
app.use('/api/odontogramas', odontogramaRoutes);
app.use('/api/dientes', dienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/planes', planTratamientoRoutes);
app.use('/api/planes', planDetalleRoutes);
app.use('/api/fotos', fotoRoutes);
app.use('/api/prescripciones', prescripcionRoutes);


app.get('/', (req, res) => {
  res.send('Patient Appointment Service - Historial clínico OK');
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Patient Appointment Service corriendo en http://localhost:${PORT}`);
});
