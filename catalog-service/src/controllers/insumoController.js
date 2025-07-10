const InsumoService = require('../services/insumoService');

exports.getAllInsumos = async (req, res) => {
  try {
    const insumos = await InsumoService.getAll();
    res.json({ success: true, data: insumos });
  } catch (error) {
    console.error('Error al obtener insumos:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getInsumoById = async (req, res) => {
  try {
    const insumo = await InsumoService.getById(req.params.id);
    if (!insumo) {
      return res.status(404).json({ success: false, error: 'Insumo no encontrado' });
    }
    res.json({ success: true, data: insumo });
  } catch (error) {
    console.error('Error al obtener insumo por ID:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createInsumo = async (req, res) => {
  try {
    const { nombre, unidad, costo_unitario, notas } = req.body;
    const nuevo = await InsumoService.create({ nombre, unidad, costo_unitario, notas });
    res.status(201).json({ success: true, data: nuevo });
  } catch (error) {
    console.error('Error al crear insumo:', error);
    res.status(500).json({ success: false, error: 'Error al crear insumo' });
  }
};

exports.updateInsumo = async (req, res) => {
  try {
    const { nombre, unidad, costo_unitario, notas } = req.body;
    const actualizado = await InsumoService.update(req.params.id, { nombre, unidad, costo_unitario, notas });
    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Insumo no encontrado' });
    }
    res.json({ success: true, data: actualizado });
  } catch (error) {
    console.error('Error al actualizar insumo:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar insumo' });
  }
};

exports.deleteInsumo = async (req, res) => {
  try {
    const eliminado = await InsumoService.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ success: false, error: 'Insumo no encontrado' });
    }
    res.json({ success: true, message: 'Insumo eliminado' });
  } catch (error) {
    console.error('Error al eliminar insumo:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar insumo' });
  }
};
