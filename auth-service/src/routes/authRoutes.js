const express = require('express');
const router = express.Router();

const { loginValidator } = require('../middlewares/validators');
const { login } = require('../controllers/authController');

router.post('/login', loginValidator, login);

module.exports = router;
