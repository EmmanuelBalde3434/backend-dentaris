const express = require('express');
const router = express.Router();
const InsumoController = require('../controllers/insumoController');

router.get('/', InsumoController.getAllInsumos);
router.get('/:id', InsumoController.getInsumoById);
router.post('/', InsumoController.createInsumo);
router.put('/:id', InsumoController.updateInsumo);
router.delete('/:id', InsumoController.deleteInsumo);

module.exports = router;
