// src/services/citaService.js
const { query } = require('./database');

class CitaService {
  static async getAll() {
    const sql = 'SELECT * FROM cita';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM cita WHERE cita_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ paciente_id, dentista_id, fecha, hora, estado = 'Agendada' }) {
    const sql = 'INSERT INTO cita (paciente_id, dentista_id, fecha, hora, estado) VALUES (?, ?, ?, ?, ?)';
    const result = await query(sql, [paciente_id, dentista_id, fecha, hora, estado]);
    return { cita_id: result.insertId, paciente_id, dentista_id, fecha, hora, estado };
  }

  static async update(id, { fecha, hora, estado }) {
    const sql = 'UPDATE cita SET fecha = ?, hora = ?, estado = ? WHERE cita_id = ?';
    const result = await query(sql, [fecha, hora, estado, id]);
    return result.affectedRows > 0 ? { cita_id: id, fecha, hora, estado } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM cita WHERE cita_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = CitaService;
