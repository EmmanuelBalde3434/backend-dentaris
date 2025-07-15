// src/routes/citaRoutes.js
const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');


router.get('/detalle', CitaController.getTodasCitasDetalle);
router.get('/:id/detalle', CitaController.getCitaDetalle);

router.get('/', CitaController.getAllCitas);
router.get('/:id', CitaController.getCitaById);
router.post('/', CitaController.createCita);
router.put('/:id', CitaController.updateCita);
router.delete('/:id', CitaController.deleteCita);



module.exports = router;
