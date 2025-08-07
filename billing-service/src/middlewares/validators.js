const { body, validationResult } = require('express-validator');

exports.balanceValidator = [
  body('tipo_mov')
    .isIn(['Ingreso', 'Egreso'])
    .withMessage('tipo_mov debe ser Ingreso o Egreso'),
  body('monto')
    .isFloat({ gt: 0 })
    .withMessage('monto debe ser numérico mayor a 0'),
  body('plan_id')
    .if(body('tipo_mov').equals('Ingreso'))
    .isInt().withMessage('plan_id requerido en Ingreso'),
  body('insumo_id')
    .if(body('tipo_mov').equals('Egreso'))
    .isInt().withMessage('insumo_id requerido en Egreso'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  }
];