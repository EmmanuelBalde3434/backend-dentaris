const express = require('express');
const router  = express.Router();

const {
  loginValidator,
  registerClinicValidator,
  patientValidator
} = require('../middlewares/validators');

const { verifyToken }    = require('../middlewares/authMiddleware');
const { login }          = require('../controllers/authController');
const { registerClinic } = require('../controllers/registerController');
const {
  createPatient,
  listPatients
} = require('../controllers/patientController');

/* ------- auth ------- */
router.post('/login',    loginValidator,          login);
router.post('/register', registerClinicValidator, registerClinic);

/* ------- pacientes ------- */
router.post('/patients', verifyToken, patientValidator, createPatient);
router.get ('/patients', verifyToken,               listPatients);

module.exports = router;
