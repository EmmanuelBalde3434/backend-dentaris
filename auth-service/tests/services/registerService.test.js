const RegisterService = require('../../src/services/registerService');

/* ------------- mocks ------------- */
jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

const db   = require('../../src/services/database');
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

describe('RegisterService.registerClinicAdmin', () => {
  beforeEach(() => jest.clearAllMocks());

  const base = {
    clinica:  'Sonrisas Felices',
    telefono: '5544332211',
    email:    'admin@clinic.com',
    password: 'MiPass123'
  };

  /* ----------- caso éxito ----------- */
  it('crea clínica y admin correctamente', async () => {
    db.query
      .mockResolvedValueOnce({})                 // START
      .mockResolvedValueOnce([])                 // dup
      .mockResolvedValueOnce([{ rol_id: 1 }])    // rol
      .mockResolvedValueOnce({ insertId: 10 })   // INSERT consultorio
      .mockResolvedValueOnce({ insertId: 20 })   // INSERT usuario
      .mockResolvedValueOnce({});                // COMMIT

    bcrypt.hash.mockResolvedValue('hashedPass');
    jwt.sign.mockReturnValue('signed-token');

    const res = await RegisterService.registerClinicAdmin(base);

    expect(res).toEqual({
      consultorio: { consultorio_id: 10, nombre: base.clinica, telefono: base.telefono },
      usuario:     { usuario_id: 20, email: base.email, rol_id: 1 },
      token:       'signed-token'
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('MiPass123', 10);
    expect(jwt.sign).toHaveBeenCalledWith(
      { usuario_id: 20, rol_id: 1 },
      'test_secret',
      { expiresIn: '8h' }
    );
  });

  /* -------- correo duplicado -------- */
  it('falla si el correo ya existe', async () => {
    db.query
      .mockResolvedValueOnce({})   // START
      .mockResolvedValueOnce([{}]) // dup encontrado
      .mockResolvedValueOnce({});  // ROLLBACK

    await expect(
      RegisterService.registerClinicAdmin(base)
    ).rejects.toThrow('El correo ya está registrado');
  });

  /* ------ rol Administrador falta ---- */
  it('falla si el rol Administrador no existe', async () => {
    db.query
      .mockResolvedValueOnce({})   // START
      .mockResolvedValueOnce([])   // dup ok
      .mockResolvedValueOnce([])   // rol vacío
      .mockResolvedValueOnce({});  // ROLLBACK

    await expect(
      RegisterService.registerClinicAdmin(base)
    ).rejects.toThrow('Rol "Administrador" no existe en la tabla rol');
  });
});