const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');

class DentistService {
  //Crear dentista
  static async createDentist(data, consultorio_id) {
    await query('START TRANSACTION');
    try {
      const [dup] = await query('SELECT 1 FROM usuario WHERE email = ?', [data.email]);
      if (dup) throw new Error('El correo ya está registrado');

      const [row] = await query(
        'SELECT rol_id FROM rol WHERE nombre_rol = ?',
        ['Dentista']
      );
      if (!row) throw new Error('Rol "Dentista" no existe');
      const rol_id = row.rol_id;

      const pwdPlain = crypto.randomBytes(9).toString('base64');
      const pwdHash  = await bcrypt.hash(pwdPlain, 10);

      const cols = [
        'rol_id','consultorio_id','nombre','apellidos','email','telefono',
        'cedula_profesional','carrera',
        'password_hash','must_reset_password','estado'
      ];
      const vals = [
        rol_id, consultorio_id,
        data.nombre, data.apellidos, data.email, data.telefono,
        data.cedula_profesional, data.carrera,
        pwdHash, true, 'Activo'
      ];
      const qs = cols.map(() => '?').join(',');
      const { insertId } = await query(
        `INSERT INTO usuario (${cols.join(',')}) VALUES (${qs})`, vals
      );
      await query('COMMIT');
      return { usuario_id: insertId };
    } catch (err) {
      await query('ROLLBACK');
      console.error('DentistService.createDentist:', err);
      throw err;
    }
  }

  //Listado de doctores
  static async listDentists(consultorio_id) {
    return query(
      `SELECT usuario_id,nombre,apellidos,email,telefono,
              cedula_profesional,carrera,created_at,updated_at
       FROM   usuario u JOIN rol r USING(rol_id)
       WHERE  r.nombre_rol='Dentista' AND u.consultorio_id = ?`,
      [consultorio_id]
    );
  }

  //Obtener dentista por id
  static async getDentistById(usuario_id, consultorio_id) {
    const [doc] = await query(
      `SELECT usuario_id,nombre,apellidos,email,telefono,
              cedula_profesional,carrera,created_at,updated_at
       FROM   usuario u JOIN rol r USING(rol_id)
       WHERE  u.usuario_id = ? AND u.consultorio_id = ?
         AND  r.nombre_rol = 'Dentista'`,
      [usuario_id, consultorio_id]
    );
    if (!doc) throw new Error('Dentista no encontrado');
    return doc;
  }

  //Actualizar dentista
  static async updateDentist(usuario_id, data, consultorio_id) {
    const [doc] = await query(
      `SELECT 1 FROM usuario u JOIN rol r USING(rol_id)
       WHERE u.usuario_id=? AND u.consultorio_id=? AND r.nombre_rol='Dentista'`,
      [usuario_id, consultorio_id]
    );
    if (!doc) throw new Error('Dentista no encontrado en este consultorio');
    
    if ('estado' in data && !['Activo','Baja'].includes(data.estado)) {
    throw new Error('Valor de estado inválido');
  }

    const permitidos = ['nombre','apellidos','email','telefono',
                        'cedula_profesional','carrera', 'estado'];
    const set = [], vals = [];
    for (const c of permitidos) {
      if (data[c] !== undefined) { set.push(`${c} = ?`); vals.push(data[c]); }
    }
    if (!set.length) throw new Error('Sin campos para actualizar');
    vals.push(usuario_id);
    await query(`UPDATE usuario SET ${set.join(', ')} WHERE usuario_id = ?`, vals);
    return { usuario_id };
  }

  //“Eliminar” dentista (marcar Baja)
  static async deleteDentist(usuario_id, consultorio_id) {
    const [doc] = await query(
      `SELECT 1 FROM usuario u JOIN rol r USING(rol_id)
       WHERE u.usuario_id=? AND u.consultorio_id=? AND r.nombre_rol='Dentista'`,
      [usuario_id, consultorio_id]
    );
    if (!doc) throw new Error('Dentista no encontrado en este consultorio');

    await query(`UPDATE usuario SET estado = 'Baja' WHERE usuario_id = ?`, [usuario_id]);

    return { usuario_id };
  }
}

module.exports = DentistService;