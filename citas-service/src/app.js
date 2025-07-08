const express = require('express');
const cors = require('cors');
const citaRoutes = require('./routes/citaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/citas', citaRoutes);

const PORT = process.env.PORT || 5002;  // Puerto diferente a auth-service
app.listen(PORT, () => {
  console.log(`Citas service running on http://localhost:${PORT}`);
});