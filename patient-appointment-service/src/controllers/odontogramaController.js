// src/controllers/odontogramaController.js
const OdontogramaService = require('../services/odontogramaService');

exports.getAllOdontogramas = async (req, res) => {
  try {
    const odontogramas = await OdontogramaService.getAll();
    res.json({ success: true, data: odontogramas });
  } catch (error) {
    console.error('Error al obtener odontogramas:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getOdontogramaById = async (req, res) => {
  try {
    const odontograma = await OdontogramaService.getById(req.params.id);
    if (!odontograma) {
      return res.status(404).json({ success: false, error: 'Odontograma no encontrado' });
    }
    res.json({ success: true, data: odontograma });
  } catch (error) {
    console.error('Error al obtener odontograma por ID:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createOdontograma = async (req, res) => {
  try {
    const { usuario_id } = req.body;
    const nuevo = await OdontogramaService.create({ usuario_id });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear odontograma:', error);
    res.status(500).json({ success: false, error: 'Error al crear odontograma' });
  }
};

exports.deleteOdontograma = async (req, res) => {
  try {
    const eliminado = await OdontogramaService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Odontograma no encontrado' });
    }
    res.json({ success: true, message: 'Odontograma eliminado' });
  } catch (error) {
    console.error('Error al eliminar odontograma:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar odontograma' });
  }
};
