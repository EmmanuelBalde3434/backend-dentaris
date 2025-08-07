require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const { loginLimiter } = require('./middlewares/rateLimiter');
const authRoutes       = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());                             

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'"],
      upgradeInsecureRequests: []  
    }
  })
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  })
);

app.use((_req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  next();
});

app.use('/api/auth/login', loginLimiter);  
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Auth Service (Dentaris) - MySQL Directo');
});

const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service corriendo en http://localhost:${PORT}`);
});
