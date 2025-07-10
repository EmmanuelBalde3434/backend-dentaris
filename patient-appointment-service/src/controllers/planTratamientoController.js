// src/controllers/planTratamientoController.js
const PlanTratamientoService = require('../services/planTratamientoService');

exports.getAllPlanes = async (req, res) => {
  try {
    const planes = await PlanTratamientoService.getAll();
    res.json({ success: true, data: planes });
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await PlanTratamientoService.getById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan no encontrado' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { cita_id, estado_pago, costo_total_estimado } = req.body;
    const nuevo = await PlanTratamientoService.create({ cita_id, estado_pago, costo_total_estimado });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ success: false, error: 'Error al crear plan (¿cita ya tiene plan?)' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { estado_pago, costo_total_estimado } = req.body;
    const actualizado = await PlanTratamientoService.update(req.params.id, { estado_pago, costo_total_estimado });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Plan no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar plan' });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const eliminado = await PlanTratamientoService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Plan no encontrado' });
    }
    res.json({ success: true, message: 'Plan eliminado' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar plan' });
  }
};
