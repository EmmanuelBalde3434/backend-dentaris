// src/routes/historialRoutes.js
const express = require('express');
const router = express.Router();
const HistorialController = require('../controllers/historialController');

router.get('/', HistorialController.getAllHistoriales);
router.get('/:id', HistorialController.getHistorialById);
router.post('/', HistorialController.createHistorial);
router.put('/:id', HistorialController.updateHistorial);
router.delete('/:id', HistorialController.deleteHistorial);

module.exports = router;
