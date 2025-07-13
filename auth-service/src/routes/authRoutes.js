const express = require('express');
const router  = express.Router();

const {
  loginValidator,
  registerClinicValidator,
  patientValidator,
  patientUpdateValidator,
  doctorValidator,
  doctorUpdateValidator
} = require('../middlewares/validators');

const { verifyToken } = require('../middlewares/authMiddleware');

const { login }            = require('../controllers/authController');
const { registerClinic }   = require('../controllers/registerController');

const {
  createPatient,
  listPatients,
  getPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

const {
  createDentist,
  listDentists,
  getDentist,
  updateDentist,
  deleteDentist
} = require('../controllers/dentistController');

// Rutas auth
router.post('/login',    loginValidator,          login);
router.post('/register', registerClinicValidator, registerClinic);

// Rutas paciente
router.post  ('/patients',      verifyToken, patientValidator,        createPatient);
router.get   ('/patients',      verifyToken,                          listPatients);
router.get   ('/patients/:id',  verifyToken,                          getPatient);
router.put   ('/patients/:id',  verifyToken, patientUpdateValidator,  updatePatient);
router.delete('/patients/:id',  verifyToken,                          deletePatient);

// Rutas dentistas
router.post  ('/dentists',      verifyToken, doctorValidator,        createDentist);
router.get   ('/dentists',      verifyToken,                         listDentists);
router.get   ('/dentists/:id',  verifyToken,                         getDentist);
router.put   ('/dentists/:id',  verifyToken, doctorUpdateValidator,  updateDentist);
router.delete('/dentists/:id',  verifyToken,                         deleteDentist);

module.exports = router;
