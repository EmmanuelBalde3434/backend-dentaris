const { mock } = require('jest-mock-extended');
const AuthService = require('../../src/services/authService');

jest.mock('../../src/services/database', () => ({
  query: jest.fn()
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

const db      = require('../../src/services/database');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

describe('AuthService.login()', () => {
  const fakeUserRow = {
    usuario_id:       1,
    email:            'admin@clinic.com',
    password_hash:    'hashed!',
    rol_id:           1,
    must_reset_password: 0,
    consultorio_id:   3,
    last_login:       null,
    consultorio_nombre:   'Sonrisas Felices',
    consultorio_telefono: '5544332211',
    consultorio_direccion:null,
    consultorio_logo:     null
  };

  const lastLogin = new Date('2025-07-14T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve usuario, consultorio y token en login exitoso', async () => {
    db.query.mockResolvedValueOnce([fakeUserRow]);
    db.query.mockResolvedValueOnce({ affectedRows: 1 });
    db.query.mockResolvedValueOnce([{ last_login: lastLogin }]);

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('signed-token');

    const result = await AuthService.login('admin@clinic.com', 'plainPassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashed!');
    expect(jwt.sign).toHaveBeenCalledWith(
      { usuario_id: 1, rol_id: 1, consultorio_id: 3 },
      'test_secret',
      { expiresIn: '8h' }
    );

    expect(result).toEqual({
      usuario: {
        usuario_id: 1,
        email: 'admin@clinic.com',
        rol_id: 1,
        consultorio_id: 3,
        last_login: lastLogin
      },
      consultorio: {
        consultorio_id: 3,
        nombre: 'Sonrisas Felices',
        telefono: '5544332211',
        direccion: null,
        logo_url: null
      },
      token: 'signed-token'
    });
  });

  it('lanza error si la contraseña es incorrecta', async () => {
    db.query.mockResolvedValueOnce([fakeUserRow]);
    bcrypt.compare.mockResolvedValue(false);    

    await expect(
      AuthService.login('admin@clinic.com', 'wrongPass')
    ).rejects.toThrow('Correo o contraseña inválidos');

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});