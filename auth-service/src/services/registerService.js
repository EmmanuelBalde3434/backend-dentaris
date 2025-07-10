// src/services/registerService.js
const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

class RegisterService {
  static async registerClinicAdmin({ clinica, telefono, email, password /* rol */ }) {
    try {
      await query('START TRANSACTION');

      const [dup] = await query(
        'SELECT 1 FROM usuario WHERE email = ?',
        [email]
      );
      if (dup) throw new Error('El correo ya está registrado');

      const [row] = await query(
        'SELECT rol_id FROM rol WHERE nombre_rol = ?',
        ['Administrador']
      );
      if (!row) throw new Error('Rol "Administrador" no existe en la tabla rol');
      const rol_id = row.rol_id;

      const { insertId: consultorio_id } = await query(
        'INSERT INTO consultorio (nombre, telefono) VALUES (?, ?)',
        [clinica, telefono]
      );

      const password_hash = await bcrypt.hash(password, 10);
      const { insertId: usuario_id } = await query(
        `INSERT INTO usuario
         (rol_id, consultorio_id, email, telefono, password_hash, must_reset_password)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rol_id, consultorio_id, email, telefono, password_hash, false]
      );

      await query('COMMIT');

      const token = jwt.sign(
        { usuario_id, rol_id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        consultorio: { consultorio_id, nombre: clinica, telefono },
        usuario:     { usuario_id, email, rol_id },
        token
      };
    } catch (err) {
      // Rollback ante cualquier error
      await query('ROLLBACK');
      console.error('Error en RegisterService.registerClinicAdmin:', err);
      throw err;
    }
  }
}

module.exports = RegisterService;
