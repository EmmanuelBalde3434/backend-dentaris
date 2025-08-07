require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const billingRoutes    = require('./routes/billingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('Billing Service – Registro de ingresos y egresos'));

app.use('/api/billing', billingRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Billing service corriendo en http://localhost:${PORT}`);
});