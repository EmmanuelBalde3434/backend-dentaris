// src/controllers/fotoProcedimientoController.js
const FotoService = require('../services/fotoProcedimientoService');
const fs = require('fs');
const path = require('path');

exports.getAllFotos = async (req, res) => {
  try {
    const fotos = await FotoService.getAll();
    res.json({ success: true, data: fotos });
  } catch (error) {
    console.error('Error al obtener fotos:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.getFotoById = async (req, res) => {
  try {
    const foto = await FotoService.getById(req.params.id);
    if (!foto) {
      return res.status(404).json({ success: false, error: 'Foto no encontrada' });
    }
    res.json({ success: true, data: foto });
  } catch (error) {
    console.error('Error al obtener foto:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

exports.createFoto = async (req, res) => {
  try {
    const { cita_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se subió ninguna imagen' });
    }

    const ruta_imagen = `/uploads/${req.file.filename}`;
    const nueva = await FotoService.create({ cita_id, ruta_imagen });

    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    console.error('Error al subir foto:', error);
    const mensaje =
      error.message.includes('formato') || error.message.includes('Formato')
        ? error.message
        : 'Error al subir foto';

    res.status(500).json({ success: false, error: mensaje });
  }
};

exports.deleteFoto = async (req, res) => {
  try {
    const foto = await FotoService.getById(req.params.id);
    if (!foto) {
      return res.status(404).json({ success: false, error: 'Foto no encontrada' });
    }

    const rutaFisica = path.join(__dirname, '..', foto.ruta_imagen);
    fs.unlink(rutaFisica, async (err) => {
      if (err) {
        console.error('⚠️ Error al borrar archivo físico:', err.message);
        return res.status(500).json({ success: false, error: 'No se pudo borrar la imagen del servidor' });
      }

      const eliminado = await FotoService.delete(req.params.id);
      if (!eliminado) {
        return res.status(500).json({ success: false, error: 'No se pudo borrar el registro de la base de datos' });
      }

      res.json({ success: true, message: 'Foto eliminada correctamente' });
    });
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar foto' });
  }
};
