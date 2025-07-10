// src/services/fotoProcedimientoService.js
const { query } = require('./database');

class FotoProcedimientoService {
  static async getAll() {
    const sql = 'SELECT * FROM foto_procedimiento';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM foto_procedimiento WHERE foto_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ cita_id, ruta_imagen }) {
    const sql = `
      INSERT INTO foto_procedimiento (cita_id, ruta_imagen)
      VALUES (?, ?)
    `;
    const result = await query(sql, [cita_id, ruta_imagen]);
    return {
      foto_id: result.insertId,
      cita_id,
      ruta_imagen,
      fecha: new Date()
    };
  }

  static async delete(id) {
    const sql = 'DELETE FROM foto_procedimiento WHERE foto_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = FotoProcedimientoService;
