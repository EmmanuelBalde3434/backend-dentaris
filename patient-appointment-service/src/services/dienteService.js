// src/services/dienteService.js
const { query } = require('./database');

class DienteService {
  static async getAll() {
    const sql = 'SELECT * FROM diente';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM diente WHERE diente_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ odontograma_id, codigo, posicion }) {
    const sql = 'INSERT INTO diente (odontograma_id, codigo, posicion) VALUES (?, ?, ?)';
    const result = await query(sql, [odontograma_id, codigo, posicion]);
    return { diente_id: result.insertId, odontograma_id, codigo, posicion };
  }

  static async update(id, { codigo, posicion }) {
    const sql = 'UPDATE diente SET codigo = ?, posicion = ? WHERE diente_id = ?';
    const result = await query(sql, [codigo, posicion, id]);
    return result.affectedRows > 0 ? { diente_id: id, codigo, posicion } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM diente WHERE diente_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = DienteService;
