// src/routes/planDetalleRoutes.js
const express = require('express');
const router = express.Router();
const PlanDetalleController = require('../controllers/planDetalleController');

// Tratamientos
router.post('/:id/tratamientos', PlanDetalleController.agregarTratamiento);
router.delete('/:id/tratamientos/:tratamientoId', PlanDetalleController.eliminarTratamiento);

// Dientes
router.post('/:id/dientes', PlanDetalleController.agregarDiente);
router.delete('/:id/dientes/:dienteId', PlanDetalleController.eliminarDiente);

module.exports = router;
