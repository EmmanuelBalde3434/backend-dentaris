// src/middlewares/multerErrorHandler.js
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof Error && err.message.includes('Formato de imagen')) {
    return res.status(400).json({ success: false, error: err.message });
  }

  return res.status(500).json({ success: false, error: 'Error al procesar archivo' });
};
