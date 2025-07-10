// src/routes/fotoProcedimientoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const FotoController = require('../controllers/fotoProcedimientoController');
const { handleMulterError } = require('../middlewares/multerErrorHandler');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const nombre = `foto_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, nombre);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetypesValidos = ['.jpg', '.jpeg', '.png'];
  if (mimetypesValidos.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no válido. Solo se permiten .jpg, .jpeg, .png.'));
  }
};

const upload = multer({ storage, fileFilter });

router.get('/', FotoController.getAllFotos);
router.get('/:id', FotoController.getFotoById);
router.post('/', upload.single('imagen'), handleMulterError, FotoController.createFoto);
router.delete('/:id', FotoController.deleteFoto);

module.exports = router;
