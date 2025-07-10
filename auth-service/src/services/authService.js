const { query } = require('./database');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

class AuthService {
  static async login(email, password) {
    try {
      const [user] = await query(
        `SELECT usuario_id, email, password_hash, rol_id, must_reset_password, consultorio_id
         FROM   usuario
         WHERE  email = ?`,
        [email]
      );

      if (!user)                     throw new Error('Correo o contraseña inválidos');
      if (!await bcrypt.compare(password, user.password_hash))
                                     throw new Error('Correo o contraseña inválidos');
      if (user.must_reset_password)  throw new Error('Debes cambiar tu contraseña');

      await query('UPDATE usuario SET last_login = NOW() WHERE usuario_id = ?', [user.usuario_id]);

      const token = jwt.sign(
        { usuario_id: user.usuario_id, rol_id: user.rol_id, consultorio_id: user.consultorio_id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        usuario: {
          usuario_id:    user.usuario_id,
          email:         user.email,
          rol_id:        user.rol_id,
          consultorio_id:user.consultorio_id
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
