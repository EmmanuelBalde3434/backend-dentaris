// src/services/citaService.js
const { query } = require('./database');

class CitaService {
  static async marcarNoAsistidas() {
    const sql = `
      UPDATE cita
      SET estado = 'No asistido', motivo = 'El paciente no asistió a su cita'
      WHERE estado = 'Agendada'
        AND CONCAT(fecha, ' ', hora) < NOW()
    `;
    await query(sql);
  }

  static async getAll() {
    await this.marcarNoAsistidas();
    const sql = 'SELECT * FROM cita';
    return await query(sql);
  }

  static async getById(id) {
    await this.marcarNoAsistidas();
    const sql = 'SELECT * FROM cita WHERE cita_id = ?';
    const [result] = await query(sql, [id]);
    return result;
  }

  static async create({ paciente_id, dentista_id, fecha, hora, estado = 'Agendada', motivo = null }) {
    const sql = 'INSERT INTO cita (paciente_id, dentista_id, fecha, hora, estado, motivo) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await query(sql, [paciente_id, dentista_id, fecha, hora, estado, motivo]);
    return { cita_id: result.insertId, paciente_id, dentista_id, fecha, hora, estado, motivo };
  }

  static async update(id, { fecha, hora, estado, motivo }) {
    const sql = 'UPDATE cita SET fecha = ?, hora = ?, estado = ?, motivo = ? WHERE cita_id = ?';
    const result = await query(sql, [fecha, hora, estado, motivo, id]);
    return result.affectedRows > 0 ? { cita_id: id, fecha, hora, estado, motivo } : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM cita WHERE cita_id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  static async getCitaConUsuarios(id) {
    await this.marcarNoAsistidas();
    const sql = `
      SELECT
        c.cita_id, c.fecha, c.hora, c.estado, c.motivo,
        p.usuario_id AS paciente_id, p.nombre AS paciente_nombre, p.email AS paciente_email, p.rol_id AS paciente_rol,
        d.usuario_id AS dentista_id, d.nombre AS dentista_nombre, d.email AS dentista_email, d.rol_id AS dentista_rol
      FROM cita c
      JOIN auth_db.usuario p ON c.paciente_id = p.usuario_id
      JOIN auth_db.usuario d ON c.dentista_id = d.usuario_id
      WHERE c.cita_id = ?
    `;
    const [result] = await query(sql, [id]);
    return result;
  }

  static async getTodasCitasConUsuarios() {
    await this.marcarNoAsistidas();
    const sql = `
      SELECT
        c.cita_id, c.fecha, c.hora, c.estado, c.motivo,
        p.usuario_id AS paciente_id, p.nombre AS paciente_nombre, p.email AS paciente_email, p.rol_id AS paciente_rol,
        d.usuario_id AS dentista_id, d.nombre AS dentista_nombre, d.email AS dentista_email, d.rol_id AS dentista_rol
      FROM cita c
      JOIN auth_db.usuario p ON c.paciente_id = p.usuario_id
      JOIN auth_db.usuario d ON c.dentista_id = d.usuario_id
      ORDER BY c.fecha, c.hora
    `;
    return await query(sql);
  }
}

module.exports = CitaService;
