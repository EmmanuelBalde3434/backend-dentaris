// src/controllers/planDetalleController.js
const PlanDetalleService = require('../services/planDetalleService');

// --- TRATAMIENTOS ---

exports.agregarTratamiento = async (req, res) => {
  try {
    const { tratamiento_id } = req.body;
    const { id: plan_id } = req.params;
    const resultado = await PlanDetalleService.addTratamiento(plan_id, tratamiento_id);
    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    console.error('Error al agregar tratamiento al plan:', error);
    res.status(500).json({ success: false, error: 'Error al asociar tratamiento' });
  }
};

exports.eliminarTratamiento = async (req, res) => {
  try {
    const { id: plan_id, tratamientoId } = req.params;
    const eliminado = await PlanDetalleService.removeTratamiento(plan_id, tratamientoId);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Asociación no encontrada' });
    }
    res.json({ success: true, message: 'Tratamiento eliminado del plan' });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar tratamiento' });
  }
};

// --- DIENTES ---

exports.agregarDiente = async (req, res) => {
  try {
    const { diente_id } = req.body;
    const { id: plan_id } = req.params;
    const resultado = await PlanDetalleService.addDiente(plan_id, diente_id);
    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    console.error('Error al agregar diente al plan:', error);
    res.status(500).json({ success: false, error: 'Error al asociar diente' });
  }
};

exports.eliminarDiente = async (req, res) => {
  try {
    const { id: plan_id, dienteId } = req.params;
    const eliminado = await PlanDetalleService.removeDiente(plan_id, dienteId);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Asociación no encontrada' });
    }
    res.json({ success: true, message: 'Diente eliminado del plan' });
  } catch (error) {
    console.error('Error al eliminar diente:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar diente' });
  }
};
