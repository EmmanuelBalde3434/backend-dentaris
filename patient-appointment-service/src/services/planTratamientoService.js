// src/services/planTratamientoService.js
const { query } = require('./database');

class PlanTratamientoService {
  static async getAll() {
    const sql = 'SELECT * FROM plan_tratamiento';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM plan_tratamiento WHERE plan_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ cita_id, estado_pago, costo_total_estimado }) {
    const sql = `
      INSERT INTO plan_tratamiento (cita_id, estado_pago, costo_total_estimado)
      VALUES (?, ?, ?)
    `;
    const result = await query(sql, [cita_id, estado_pago, costo_total_estimado]);
    return {
      plan_id: result.insertId,
      cita_id,
      estado_pago,
      costo_total_estimado,
      fecha_creacion: new Date()
    };
  }

  static async update(id, { estado_pago, costo_total_estimado }) {
    const sql = `
      UPDATE plan_tratamiento
      SET estado_pago = ?, costo_total_estimado = ?
      WHERE plan_id = ?
    `;
    const result = await query(sql, [estado_pago, costo_total_estimado, id]);
    return result.affectedRows > 0
      ? { plan_id: id, estado_pago, costo_total_estimado }
      : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM plan_tratamiento WHERE plan_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = PlanTratamientoService;
