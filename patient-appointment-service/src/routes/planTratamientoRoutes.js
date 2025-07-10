// src/routes/planTratamientoRoutes.js
const express = require('express');
const router = express.Router();
const PlanTratamientoController = require('../controllers/planTratamientoController');

router.get('/', PlanTratamientoController.getAllPlanes);
router.get('/:id', PlanTratamientoController.getPlanById);
router.post('/', PlanTratamientoController.createPlan);
router.put('/:id', PlanTratamientoController.updatePlan);
router.delete('/:id', PlanTratamientoController.deletePlan);

module.exports = router;
