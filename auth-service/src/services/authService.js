//services/authService.js
const { query } = require('./database'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  static async login(email, password) {
    try {
      const [user] = await query(
        `SELECT usuario_id, email, password_hash, rol_id, must_reset_password 
         FROM usuario WHERE email = ?`, 
        [email]
      );

      if (!user) throw new Error('Usuario no registrado');

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) throw new Error('Contraseña incorrecta');

      if (user.must_reset_password) {
        throw new Error('Debes cambiar tu contraseña');
      }

      const token = jwt.sign(
        { 
          usuario_id: user.usuario_id,
          rol_id: user.rol_id  
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        usuario: {
          usuario_id: user.usuario_id,
          email: user.email,
          rol_id: user.rol_id
        },
        token
      };
    } catch (error) {
      console.error('Error en AuthService.login:', error);
      throw error;
    }
  }
}

module.exports = AuthService;