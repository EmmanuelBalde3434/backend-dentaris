const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');

class PatientService {
  static async createPatient(data, consultorio_id) {
    try {
      await query('START TRANSACTION');

      /* Correo duplicado */
      const [dup] = await query('SELECT 1 FROM usuario WHERE email = ?', [data.email]);
      if (dup) throw new Error('El correo ya está registrado');

      const [row] = await query(
        'SELECT rol_id FROM rol WHERE nombre_rol = ?',
        [data.rol]                                         
      );
      if (!row) throw new Error('Rol "Paciente" no existe');
      const rol_id = row.rol_id;

      const pwdPlain = crypto.randomBytes(9).toString('base64');
      const pwdHash  = await bcrypt.hash(pwdPlain, 10);

      const cols = [
        'rol_id','consultorio_id','nombre','apellidos','email','telefono',
        'fecha_nacimiento','genero','pais_origen','direccion','notas','alergias',
        'profesion','numero_identificacion','nombre_contacto_emergencia',
        'telefono_contacto_emergencia','password_hash','must_reset_password'
      ];
      const vals = [
        rol_id, consultorio_id,
        data.nombre, data.apellidos, data.email, data.telefono,
        data.fecha_nacimiento, data.genero, data.pais_origen, data.direccion,
        data.notas, data.alergias, data.profesion, data.numero_identificacion,
        data.nombre_contacto_emergencia, data.telefono_contacto_emergencia,
        pwdHash, true
      ];
      const qs = cols.map(() => '?').join(',');
      const { insertId } = await query(
        `INSERT INTO usuario (${cols.join(',')}) VALUES (${qs})`,
        vals
      );

      await query('COMMIT');
      return { usuario_id: insertId };
    } catch (err) {
      await query('ROLLBACK');
      console.error('Error en PatientService.createPatient:', err);
      throw err;
    }
  }

  static async listPatients(consultorio_id) {
    try {
      const rows = await query(
        `SELECT
           usuario_id, nombre, apellidos, email, telefono,
           fecha_nacimiento, genero, pais_origen, direccion,
           notas, alergias, profesion, numero_identificacion,
           nombre_contacto_emergencia, telefono_contacto_emergencia,
           created_at, updated_at
         FROM   usuario u
         JOIN   rol r USING (rol_id)
         WHERE  r.nombre_rol = 'Paciente'
           AND  u.consultorio_id = ?`,
        [consultorio_id]
      );
      return rows;                             
    } catch (err) {
      console.error('Error en PatientService.listPatients:', err);
      throw err;
    }
  }
}

module.exports = PatientService;
