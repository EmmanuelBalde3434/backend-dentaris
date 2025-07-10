// routes/tratamientoRoutes.js
const express = require('express');
const router = express.Router();

const TratamientoController = require('../controllers/tratamientoController');

router.get('/', TratamientoController.getAllTratamientos);
router.get('/:id', TratamientoController.getTratamientoById);
router.post('/', TratamientoController.createTratamiento);
router.put('/:id', TratamientoController.updateTratamiento);
router.delete('/:id', TratamientoController.deleteTratamiento);

module.exports = router;
