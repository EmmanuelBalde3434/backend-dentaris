// src/services/odontogramaService.js
const { query } = require('./database');

class OdontogramaService {
  static async getAll() {
    const sql = 'SELECT * FROM odontograma';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM odontograma WHERE odontograma_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ usuario_id }) {
    const sql = 'INSERT INTO odontograma (usuario_id) VALUES (?)';
    const result = await query(sql, [usuario_id]);
    return { odontograma_id: result.insertId, usuario_id };
  }

  static async delete(id) {
    const sql = 'DELETE FROM odontograma WHERE odontograma_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = OdontogramaService;
