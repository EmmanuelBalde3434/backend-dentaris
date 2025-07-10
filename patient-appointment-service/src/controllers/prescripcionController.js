// src/controllers/prescripcionController.js
const PrescripcionService = require('../services/prescripcionService');

exports.getAllPrescripciones = async (req, res) => {
  try {
    const data = await PrescripcionService.getAll();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al obtener prescripciones:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getPrescripcionById = async (req, res) => {
  try {
    const prescripcion = await PrescripcionService.getById(req.params.id);
    if (!prescripcion) {
      return res.status(404).json({ success: false, error: 'Prescripción no encontrada' });
    }
    res.json({ success: true, data: prescripcion });
  } catch (error) {
    console.error('Error al obtener prescripción:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createPrescripcion = async (req, res) => {
  try {
    const nueva = await PrescripcionService.create(req.body);
    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    console.error('Error al crear prescripción:', error);
    res.status(500).json({ success: false, error: 'Error al crear prescripción' });
  }
};

exports.updatePrescripcion = async (req, res) => {
  try {
    const actualizada = await PrescripcionService.update(req.params.id, req.body);
    if (!actualizada) {
      return res.status(404).json({ success: false, error: 'Prescripción no encontrada' });
    }
    res.json({ success: true, data: actualizada });
  } catch (error) {
    console.error('Error al actualizar prescripción:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar prescripción' });
  }
};

exports.deletePrescripcion = async (req, res) => {
  try {
    const eliminado = await PrescripcionService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Prescripción no encontrada' });
    }
    res.json({ success: true, message: 'Prescripción eliminada' });
  } catch (error) {
    console.error('Error al eliminar prescripción:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar prescripción' });
  }
};
