// src/routes/prescripcionRoutes.js
const express = require('express');
const router = express.Router();
const PrescripcionController = require('../controllers/prescripcionController');

router.get('/', PrescripcionController.getAllPrescripciones);
router.get('/:id', PrescripcionController.getPrescripcionById);
router.post('/', PrescripcionController.createPrescripcion);
router.put('/:id', PrescripcionController.updatePrescripcion);
router.delete('/:id', PrescripcionController.deletePrescripcion);

module.exports = router;
