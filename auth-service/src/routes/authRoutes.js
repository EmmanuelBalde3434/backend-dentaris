const express = require('express');
const router  = express.Router();

const {
  loginValidator,
  registerClinicValidator,
  patientValidator,
  patientUpdateValidator
} = require('../middlewares/validators');

const { verifyToken }    = require('../middlewares/authMiddleware');
const { login }          = require('../controllers/authController');
const { registerClinic } = require('../controllers/registerController');
const {
  createPatient,
  listPatients,
  updatePatient
} = require('../controllers/patientController');

/* ------- auth ------- */
router.post('/login',    loginValidator,          login);
router.post('/register', registerClinicValidator, registerClinic);

/* ------- pacientes ------- */
router.post('/patients', verifyToken, patientValidator, createPatient);
router.get ('/patients', verifyToken,               listPatients);
router.put('/patients/:id', verifyToken, patientUpdateValidator, updatePatient);

module.exports = router;
