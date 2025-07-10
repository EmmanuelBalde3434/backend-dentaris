// src/controllers/dienteController.js
const DienteService = require('../services/dienteService');

exports.getAllDientes = async (req, res) => {
  try {
    const dientes = await DienteService.getAll();
    res.json({ success: true, data: dientes });
  } catch (error) {
    console.error('Error al obtener dientes:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getDienteById = async (req, res) => {
  try {
    const diente = await DienteService.getById(req.params.id);
    if (!diente) {
      return res.status(404).json({ success: false, error: 'Diente no encontrado' });
    }
    res.json({ success: true, data: diente });
  } catch (error) {
    console.error('Error al obtener diente:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createDiente = async (req, res) => {
  try {
    const { odontograma_id, codigo, posicion } = req.body;
    const nuevo = await DienteService.create({ odontograma_id, codigo, posicion });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear diente:', error);
    res.status(500).json({ success: false, error: 'Error al crear diente (¿quizá ya existe el código para ese odontograma?)' });
  }
};

exports.updateDiente = async (req, res) => {
  try {
    const { codigo, posicion } = req.body;
    const actualizado = await DienteService.update(req.params.id, { codigo, posicion });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Diente no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar diente:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar diente' });
  }
};

exports.deleteDiente = async (req, res) => {
  try {
    const eliminado = await DienteService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Diente no encontrado' });
    }
    res.json({ success: true, message: 'Diente eliminado' });
  } catch (error) {
    console.error('Error al eliminar diente:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar diente' });
  }
};
