const { query } = require('./database');

class InsumoService {
  static async getAll() {
    const sql = 'SELECT * FROM insumo';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM insumo WHERE insumo_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ nombre, unidad, costo_unitario, notas }) {
    const sql = 'INSERT INTO insumo (nombre, unidad, costo_unitario, notas) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [nombre, unidad, costo_unitario, notas]);
    return { insumo_id: result.insertId, nombre, unidad, costo_unitario, notas };
  }

  static async update(id, { nombre, unidad, costo_unitario, notas }) {
    const sql = 'UPDATE insumo SET nombre = ?, unidad = ?, costo_unitario = ?, notas = ? WHERE insumo_id = ?';
    const result = await query(sql, [nombre, unidad, costo_unitario, notas, id]);
    return result.affectedRows > 0 ? { insumo_id: id, nombre, unidad, costo_unitario, notas } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM insumo WHERE insumo_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = InsumoService;
