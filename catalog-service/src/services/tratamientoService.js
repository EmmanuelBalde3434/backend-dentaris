// services/tratamientoService.js
const { query } = require('./database');

class TratamientoService {
  static async getAll() {
    const sql = 'SELECT * FROM tratamiento';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM tratamiento WHERE tratamiento_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ nombre, precio_unitario }) {
    const sql = 'INSERT INTO tratamiento (nombre, precio_unitario) VALUES (?, ?)';
    const result = await query(sql, [nombre, precio_unitario]);
    return { tratamiento_id: result.insertId, nombre, precio_unitario };
  }

  static async update(id, { nombre, precio_unitario }) {
    const sql = 'UPDATE tratamiento SET nombre = ?, precio_unitario = ? WHERE tratamiento_id = ?';
    const result = await query(sql, [nombre, precio_unitario, id]);
    return result.affectedRows > 0 ? { tratamiento_id: id, nombre, precio_unitario } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM tratamiento WHERE tratamiento_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TratamientoService;
