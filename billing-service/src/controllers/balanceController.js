const BalanceService = require('../services/balanceService');

exports.createMovimiento = async (req, res) => {
  try {
    const consultorio_id = req.user.consultorio_id;
    const out = await BalanceService.create({ consultorio_id, ...req.body });
    res.status(201).json({ success: true, ...out });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
};

exports.listMovimientos = async (req, res) => {
  try {
    const rows = await BalanceService.getAll(req.user.consultorio_id);
    res.json({ success: true, movimientos: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

exports.getMovimiento = async (req, res) => {
  try {
    const row = await BalanceService.getById(req.params.id, req.user.consultorio_id);
    if (!row)
      return res.status(404).json({ success: false, error: 'Movimiento no encontrado' });
    res.json({ success: true, movimiento: row });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

exports.syncIngresos = async (_, res) => {
  try {
    const n = await BalanceService.syncIngresosPorCitas();
    res.json({ success: true, insertados: n, monto_promedio: 800 });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};