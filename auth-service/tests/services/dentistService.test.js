const DentistService = require('../../src/services/dentistService');

/* ------------ mocks globales ------------ */
jest.mock('../../src/services/database', () => ({ query: jest.fn() }));
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('crypto', () => ({ randomBytes: jest.fn() }));

const db      = require('../../src/services/database');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');

describe('DentistService', () => {
  beforeEach(() => jest.clearAllMocks());

  /* ========== createDentist ========== */
  describe('createDentist', () => {
    const baseData = {
      rol: 'Dentista',
      nombre: 'Laura',
      apellidos: 'García',
      email: 'laura@clinic.com',
      telefono: '5559876543',
      cedula_profesional: '1234567',
      carrera: 'Odontología'
    };

    it('crea dentista cuando todo es válido', async () => {
      /* secuencia de queries esperada: START → dup → rol → INSERT → COMMIT */
      db.query
        .mockResolvedValueOnce({})               // START TRANSACTION
        .mockResolvedValueOnce([])               // dup comprobación
        .mockResolvedValueOnce([{ rol_id: 2 }])  // SELECT rol
        .mockResolvedValueOnce({ insertId: 55 }) // INSERT
        .mockResolvedValueOnce({});              // COMMIT

      crypto.randomBytes.mockReturnValue(Buffer.from('123456789'));  // buffer fijo
      bcrypt.hash.mockResolvedValue('hashedPass');

      const res = await DentistService.createDentist(baseData, 3);

      expect(res).toEqual({ usuario_id: 55 });

      const pwdBase64 = Buffer.from('123456789').toString('base64');
      expect(bcrypt.hash).toHaveBeenCalledWith(pwdBase64, 10);
    });

    it('lanza error si el correo ya existe', async () => {
      db.query
        .mockResolvedValueOnce({})   // START
        .mockResolvedValueOnce([{}]); // dup encontrado

      await expect(
        DentistService.createDentist(baseData, 3)
      ).rejects.toThrow('El correo ya está registrado');

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  /* ========== deleteDentist ========== */
  describe('deleteDentist', () => {
    it('elimina dentista existente', async () => {
      db.query
        .mockResolvedValueOnce([{}]) // existe
        .mockResolvedValueOnce({});  // DELETE

      const res = await DentistService.deleteDentist(42, 3);

      expect(res).toEqual({ usuario_id: 42 });
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM usuario WHERE usuario_id = ?',
        [42]
      );
    });

    it('lanza error si el dentista no pertenece al consultorio', async () => {
      db.query.mockResolvedValueOnce([]); // no encontrado

      await expect(
        DentistService.deleteDentist(99, 3)
      ).rejects.toThrow('Dentista no encontrado en este consultorio');
    });
  });
});