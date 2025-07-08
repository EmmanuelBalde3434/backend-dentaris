const express = require('express');
const cors = require('cors');
const { loginLimiter } = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth/login', loginLimiter);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth Service (Dentaris) - MySQL Directo');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service corriendo en http://localhost:${PORT}`);
});
