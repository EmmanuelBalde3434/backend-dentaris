const { body, validationResult } = require('express-validator');

//Validacion login
exports.loginValidator = [
  body('email').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

//Validacion registro clinica y admin
exports.registerClinicValidator = [
  body('clinica')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nombre de clínica de 3 a 100 caracteres'),
  body('telefono')
    .isLength({ min: 8, max: 20 })
    .withMessage('Teléfono entre 8 y 20 dígitos')
    .matches(/^\d+$/)
    .withMessage('El teléfono sólo debe contener números'),
  body('email')
    .isEmail()
    .withMessage('Correo inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('rol')
    .trim()
    .equals('Administrador')
    .withMessage('El rol debe ser exactamente "Administrador"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

//Validacion registro paciente
exports.patientValidator = [
  body('rol').trim().equals('Paciente')
             .withMessage('El rol debe ser exactamente "Paciente"'),
  body('nombre').isLength({ min: 2 }).withMessage('Nombre requerido'),
  body('apellidos').isLength({ min: 2 }).withMessage('Apellidos requeridos'),
  body('email').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('telefono').optional({ checkFalsy: true }),
  body('fecha_nacimiento').isISO8601().withMessage('Fecha inválida (YYYY-MM-DD)'),
  body('genero').isIn(['M', 'F', 'O']).withMessage('Género debe ser M, F u O'),
  body('pais_origen').optional(),
  body('direccion').optional(),
  body('notas').optional(),
  body('alergias').optional(),
  body('profesion').optional(),
  body('numero_identificacion').optional(),
  body('nombre_contacto_emergencia').optional(),
  body('telefono_contacto_emergencia').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];