const { query } = require('./database');

const AVERAGE_CITA_MXN = 800;

class BalanceService {
  static async create({ consultorio_id, monto, tipo_mov, plan_id, insumo_id }) {
    const sql = `
      INSERT INTO balance
        (consultorio_id, monto, tipo_mov, plan_id, insumo_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const { insertId } = await query(sql, [
      consultorio_id, monto, tipo_mov, plan_id ?? null, insumo_id ?? null,
    ]);
    return { balance_id: insertId, consultorio_id, monto, tipo_mov, plan_id, insumo_id };
  }

  static getAll(consultorio_id) {
    return query(
      'SELECT * FROM balance WHERE consultorio_id = ? ORDER BY fecha DESC',
      [consultorio_id]
    );
  }

  static async getById(id, consultorio_id) {
    const [row] = await query(
      'SELECT * FROM balance WHERE balance_id = ? AND consultorio_id = ?',
      [id, consultorio_id]
    );
    return row;
  }

  static async syncIngresosPorCitas() {
    const rows = await query(`
      SELECT  p.plan_id,
              c.consultorio_id
      FROM    patient_appointment_db.plan_tratamiento p
      JOIN    patient_appointment_db.cita c  ON c.cita_id = p.cita_id
      WHERE   c.estado = 'Realizada'
        AND   NOT EXISTS (
              SELECT 1
              FROM   balance b
              WHERE  b.plan_id = p.plan_id )
    `);

    for (const r of rows) {
      await query(
        `INSERT INTO balance
           (consultorio_id, monto, tipo_mov, plan_id)
         VALUES (?, ?, 'Ingreso', ?)`,
        [r.consultorio_id, AVERAGE_CITA_MXN, r.plan_id]
      );
    }
    return rows.length;         
  }
}

module.exports = BalanceService;