const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

class AuthService {
  static async login(email, password) {
    try {
      const [user] = await query(
        `SELECT  u.usuario_id, u.email, u.password_hash, u.rol_id,
                u.must_reset_password, u.consultorio_id, u.last_login,
                c.nombre       AS consultorio_nombre,
                c.telefono     AS consultorio_telefono,
                c.direccion    AS consultorio_direccion,
                c.logo_url     AS consultorio_logo
         FROM    usuario u
         JOIN    consultorio c ON c.consultorio_id = u.consultorio_id
         WHERE   u.email = ?`,
        [email]
      );

      if (!user)                     throw new Error('Correo o contraseña inválidos');
      if (!await bcrypt.compare(password, user.password_hash))
                                     throw new Error('Correo o contraseña inválidos');
      if (user.must_reset_password)  throw new Error('Debes cambiar tu contraseña');

      await query('UPDATE usuario SET last_login = NOW() WHERE usuario_id = ?', [user.usuario_id]);

      const [ts] = await query(
        'SELECT last_login FROM usuario WHERE usuario_id = ?',
        [user.usuario_id]
      );

      const token = jwt.sign(
        {
          usuario_id:     user.usuario_id,
          rol_id:         user.rol_id,
          consultorio_id: user.consultorio_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        usuario: {
          usuario_id:    user.usuario_id,
          email:         user.email,
          rol_id:        user.rol_id,
          consultorio_id:user.consultorio_id,
          last_login:    ts.last_login          
        },
        consultorio: {
          consultorio_id: user.consultorio_id,
          nombre:         user.consultorio_nombre,
          telefono:       user.consultorio_telefono,
          direccion:      user.consultorio_direccion,
          logo_url:       user.consultorio_logo
        },
        token
      };
    } catch (err) {
      console.error('Error en AuthService.login:', err);
      throw err;
    }
  }
}

module.exports = AuthService;