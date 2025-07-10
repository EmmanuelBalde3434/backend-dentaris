// src/routes/odontogramaRoutes.js
const express = require('express');
const router = express.Router();
const OdontogramaController = require('../controllers/odontogramaController');

router.get('/', OdontogramaController.getAllOdontogramas);
router.get('/:id', OdontogramaController.getOdontogramaById);
router.post('/', OdontogramaController.createOdontograma);
router.delete('/:id', OdontogramaController.deleteOdontograma);

module.exports = router;
