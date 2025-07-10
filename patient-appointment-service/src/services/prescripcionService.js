// src/services/prescripcionService.js
const { query } = require('./database');

class PrescripcionService {
  static async getAll() {
    const sql = 'SELECT * FROM prescripcion';
    return await query(sql);
  }

  static async getById(id) {
    const sql = 'SELECT * FROM prescripcion WHERE prescripcion_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create(data) {
    const {
      cita_id, farmaco, marca, dosificacion,
      cantidad, frecuencia, duracion
    } = data;

    const sql = `
      INSERT INTO prescripcion (
        cita_id, farmaco, marca, dosificacion,
        cantidad, frecuencia, duracion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      cita_id, farmaco, marca, dosificacion,
      cantidad, frecuencia, duracion
    ]);
    return { prescripcion_id: result.insertId, ...data };
  }

  static async update(id, data) {
    const {
      farmaco, marca, dosificacion,
      cantidad, frecuencia, duracion
    } = data;

    const sql = `
      UPDATE prescripcion SET
        farmaco = ?, marca = ?, dosificacion = ?,
        cantidad = ?, frecuencia = ?, duracion = ?
      WHERE prescripcion_id = ?
    `;
    const result = await query(sql, [
      farmaco, marca, dosificacion,
      cantidad, frecuencia, duracion, id
    ]);
    return result.affectedRows > 0 ? { prescripcion_id: id, ...data } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM prescripcion WHERE prescripcion_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = PrescripcionService;
