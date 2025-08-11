const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');

class PatientService {

  // Crear paciente
  static async createPatient(data, consultorio_id) {
    try {
      await query('START TRANSACTION');

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
        'telefono_contacto_emergencia','password_hash','must_reset_password','estado'
      ];
      const vals = [
        rol_id, consultorio_id,
        data.nombre, data.apellidos, data.email, data.telefono,
        data.fecha_nacimiento, data.genero, data.pais_origen, data.direccion,
        data.notas, data.alergias, data.profesion, data.numero_identificacion,
        data.nombre_contacto_emergencia, data.telefono_contacto_emergencia,
        pwdHash, true, 'Activo'
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

  // Listar pacientes
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

  // Actualizar pacientes
  static async updatePatient(usuario_id, data, consultorio_id) {
    try {
      const [pac] = await query(
        `SELECT u.usuario_id
        FROM   usuario u
        JOIN   rol r USING(rol_id)
        WHERE  u.usuario_id = ? AND u.consultorio_id = ? AND r.nombre_rol = 'Paciente'`,
        [usuario_id, consultorio_id]
      );
      if (!pac) throw new Error('Paciente no encontrado en este consultorio');

      const camposPermitidos = [
        'nombre','apellidos','email','telefono','fecha_nacimiento','genero',
        'pais_origen','direccion','notas','alergias','profesion',
        'numero_identificacion','nombre_contacto_emergencia',
        'telefono_contacto_emergencia','estado' 
      ];

      if ('estado' in data && !['Activo','Baja'].includes(data.estado)) {
        throw new Error('Valor de estado inválido');
      }

      const setParts = [];
      const values   = [];

      for (const campo of camposPermitidos) {
        if (data[campo] !== undefined) {
          setParts.push(`${campo} = ?`);
          values.push(data[campo]);
        }
      }

      if (setParts.length === 0) throw new Error('Sin campos para actualizar');

      values.push(usuario_id);

      await query(
        `UPDATE usuario SET ${setParts.join(', ')} WHERE usuario_id = ?`, 
        values
      );

      return { usuario_id };
    } catch (err) {
      console.error('Error en PatientService.updatePatient:', err);
      throw err;
    }
  }

  // Buscar paciente por id
  static async getPatientById(usuario_id, consultorio_id) {
    try {
      const [pac] = await query(
        `SELECT
           usuario_id, nombre, apellidos, email, telefono,
           fecha_nacimiento, genero, pais_origen, direccion,
           notas, alergias, profesion, numero_identificacion,
           nombre_contacto_emergencia, telefono_contacto_emergencia,
           created_at, updated_at
         FROM   usuario u
         JOIN   rol r USING (rol_id)
         WHERE  u.usuario_id = ?
           AND  u.consultorio_id = ?
           AND  r.nombre_rol = 'Paciente'`,
        [usuario_id, consultorio_id]
      );

      if (!pac) throw new Error('Paciente no encontrado');

      return pac;
    } catch (err) {
      console.error('Error en PatientService.getPatientById:', err);
      throw err;
    }
  }

  //“Eliminar” paciente (marcar Baja)
  static async deletePatient(usuario_id, consultorio_id) {
    try {
      const [pac] = await query(
        `SELECT u.usuario_id
         FROM   usuario u
         JOIN   rol r USING (rol_id)
         WHERE  u.usuario_id = ?
           AND  u.consultorio_id = ?
           AND  r.nombre_rol = 'Paciente'`,
        [usuario_id, consultorio_id]
      );
      if (!pac) throw new Error('Paciente no encontrado en este consultorio');

      await query(`UPDATE usuario SET estado = 'Baja' WHERE usuario_id = ?`, [usuario_id]);

      return { usuario_id };
    } catch (err) {
      console.error('Error en PatientService.deletePatient:', err);
      throw err;
    }
  }
}

module.exports = PatientService;