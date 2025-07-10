// src/controllers/historialController.js
const HistorialService = require('../services/historialService');

exports.getAllHistoriales = async (req, res) => {
  try {
    const historiales = await HistorialService.getAll();
    res.json({ success: true, data: historiales });
  } catch (error) {
    console.error('Error al obtener historiales:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getHistorialById = async (req, res) => {
  try {
    const historial = await HistorialService.getById(req.params.id);
    if (!historial) {
      return res.status(404).json({ success: false, error: 'Historial no encontrado' });
    }
    res.json({ success: true, data: historial });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createHistorial = async (req, res) => {
  try {
    const { usuario_id, detalles } = req.body;
    const nuevo = await HistorialService.create({ usuario_id, detalles });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear historial:', error);
    res.status(500).json({ success: false, error: 'Error al crear historial' });
  }
};

exports.updateHistorial = async (req, res) => {
  try {
    const { detalles } = req.body;
    const actualizado = await HistorialService.update(req.params.id, { detalles });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Historial no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar historial:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar historial' });
  }
};

exports.deleteHistorial = async (req, res) => {
  try {
    const eliminado = await HistorialService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Historial no encontrado' });
    }
    res.json({ success: true, message: 'Historial eliminado' });
  } catch (error) {
    console.error('Error al eliminar historial:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar historial' });
  }
};
