// src/routes/dienteRoutes.js
const express = require('express');
const router = express.Router();
const DienteController = require('../controllers/dienteController');

router.get('/', DienteController.getAllDientes);
router.get('/:id', DienteController.getDienteById);
router.post('/', DienteController.createDiente);
router.put('/:id', DienteController.updateDiente);
router.delete('/:id', DienteController.deleteDiente);

module.exports = router;
