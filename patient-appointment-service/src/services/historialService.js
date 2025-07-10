// src/services/historialService.js
const { query } = require('./database');

class HistorialService {
  static async getAll() {
    const sql = 'SELECT * FROM historial_clinico';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM historial_clinico WHERE historial_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ usuario_id, detalles }) {
    const sql = 'INSERT INTO historial_clinico (usuario_id, detalles) VALUES (?, ?)';
    const result = await query(sql, [usuario_id, detalles]);
    return {
      historial_id: result.insertId,
      usuario_id,
      detalles,
      fecha_creacion: new Date()
    };
  }

  static async update(id, { detalles }) {
    const sql = 'UPDATE historial_clinico SET detalles = ? WHERE historial_id = ?';
    const result = await query(sql, [detalles, id]);
    return result.affectedRows > 0 ? { historial_id: id, detalles } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM historial_clinico WHERE historial_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = HistorialService;
