// src/services/planDetalleService.js
const { query } = require('./database');

class PlanDetalleService {

  static async addTratamiento(plan_id, tratamiento_id) {
    const sql = `
      INSERT INTO plan_tratamiento_tratamiento (plan_id, tratamiento_id)
      VALUES (?, ?)
    `;
    await query(sql, [plan_id, tratamiento_id]);
    return { plan_id, tratamiento_id };
  }

  static async removeTratamiento(plan_id, tratamiento_id) {
    const sql = `
      DELETE FROM plan_tratamiento_tratamiento
      WHERE plan_id = ? AND tratamiento_id = ?
    `;
    const result = await query(sql, [plan_id, tratamiento_id]);
    return result.affectedRows > 0;
  }

  // Dientes

  static async addDiente(plan_id, diente_id) {
    const sql = `
      INSERT INTO plan_tratamiento_diente (plan_id, diente_id)
      VALUES (?, ?)
    `;
    await query(sql, [plan_id, diente_id]);
    return { plan_id, diente_id };
  }

  static async removeDiente(plan_id, diente_id) {
    const sql = `
      DELETE FROM plan_tratamiento_diente
      WHERE plan_id = ? AND diente_id = ?
    `;
    const result = await query(sql, [plan_id, diente_id]);
    return result.affectedRows > 0;
  }
}

module.exports = PlanDetalleService;
