// src/controllers/citaController.js
const CitaService = require('../services/citaService');

exports.getAllCitas = async (req, res) => {
  try {
    const citas = await CitaService.getAll();
    res.json({ success: true, data: citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getCitaById = async (req, res) => {
  try {
    const cita = await CitaService.getById(req.params.id);
    if (!cita) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada' });
    }
    res.json({ success: true, data: cita });
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createCita = async (req, res) => {
  try {
    const { paciente_id, dentista_id, fecha, hora, estado } = req.body;
    const nueva = await CitaService.create({ paciente_id, dentista_id, fecha, hora, estado });
    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ success: false, error: 'Error al crear cita' });
  }
};

exports.updateCita = async (req, res) => {
  try {
    const { fecha, hora, estado } = req.body;
    const actualizada = await CitaService.update(req.params.id, { fecha, hora, estado });
    if (!actualizada) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada' });
    }
    res.json({ success: true, data: actualizada });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar cita' });
  }
};

exports.deleteCita = async (req, res) => {
  try {
    const eliminado = await CitaService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Cita no encontrada' });
    }
    res.json({ success: true, message: 'Cita eliminada' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar cita' });
  }
};
