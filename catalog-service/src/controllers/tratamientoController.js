// controllers/tratamientoController.js
const TratamientoService = require('../services/tratamientoService');

exports.getAllTratamientos = async (req, res) => {
  try {
    const tratamientos = await TratamientoService.getAll();
    res.json({ success: true, data: tratamientos });
  } catch (error) {
    console.error('Error al obtener tratamientos:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getTratamientoById = async (req, res) => {
  try {
    const tratamiento = await TratamientoService.getById(req.params.id);
    if (!tratamiento) {
      return res.status(404).json({ success: false, error: 'Tratamiento no encontrado' });
    }
    res.json({ success: true, data: tratamiento });
  } catch (error) {
    console.error('Error al obtener tratamiento por ID:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createTratamiento = async (req, res) => {
  try {
    const { nombre, precio_unitario } = req.body;
    const nuevo = await TratamientoService.create({ nombre, precio_unitario });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    res.status(500).json({ success: false, error: 'Error al crear tratamiento' });
  }
};

exports.updateTratamiento = async (req, res) => {
  try {
    const { nombre, precio_unitario } = req.body;
    const actualizado = await TratamientoService.update(req.params.id, { nombre, precio_unitario });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Tratamiento no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar tratamiento:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar tratamiento' });
  }
};

exports.deleteTratamiento = async (req, res) => {
  try {
    const eliminado = await TratamientoService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Tratamiento no encontrado' });
    }
    res.json({ success: true, message: 'Tratamiento eliminado' });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar tratamiento' });
  }
};
